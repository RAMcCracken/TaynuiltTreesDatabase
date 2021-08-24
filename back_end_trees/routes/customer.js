const express = require('express');
const router = express.Router();
const util = require('../utilities');

// Middleware if we had any.
router.use(function (req, res, next) {
  next()
})

// Returns all customers with their phone numbers comma seperated
router.get('/', function (req, res) {
  let db_pool = req.app.get('db_pool');
  let e_msg = "Err: GET /api/customer -";
  db_pool.getConnection()
    .then(conn => {
      conn.query(`
        SELECT c.*, GROUP_CONCAT(cp.phone_number) AS phone_numbers 
        FROM Customer c
        LEFT JOIN Customer_Phone cp ON
          c.customer_ref = cp.customer_ref
        GROUP BY c.customer_ref
        `)
        .then(rows => {
          conn.end();
          res.send(rows);
        })
        .catch(err => {
          util.handle_sql_error(`getting customers`, e_msg, 500, err, res, conn);
        })
      })
      .catch(err => {
        util.handle_sql_error(`getting connection from pool`, e_msg, 500, err, res, conn);
      })
})

// Add a new customer, with phone numbers, using a transaction in case either insertion fails
router.post('/', async function (req, res) {
  let db_pool = req.app.get('db_pool');
  let e_msg = "Err: POST /api/customer -";
  let c = req.body
  db_pool.getConnection()
    .then(conn => {
      conn.beginTransaction()
        .then(() => {
          conn.query(`
            INSERT INTO Customer (customer_ref, firstname, surname,
            email, company, address_number, address_street, address_town,
            address_postcode) 
            VALUES(?,?,?,?,?,?,?,?,?)
          `, [c.customer_ref,c.firstname,c.surname,c.email,c.company,c.address_number,c.address_street,c.address_town,c.address_postcode])
            .then(() => {
              conn.batch(`
              INSERT INTO Customer_Phone (customer_ref, phone_number) VALUES (?, ?)
              `, c.phone_numbers)
                .then(() => {
                  conn.commit();
                  conn.end();
                  res.json(c);
                })
                .catch((err) => {
                  util.handle_sql_error(`adding customer, phone number insertsion failed`, e_msg, 500, err, res, conn);
                })
            })
            .catch((err) => {
              util.handle_sql_error(`adding customer`, e_msg, 500, err, res, conn);
            })
      })
      .catch((err) => {
        util.handle_sql_error(`whilst starting transaction`, e_msg, 500, err, res, conn);
      })
  })
  .catch((err) => {
    util.handle_sql_error(`getting connection from pool`, e_msg, 500, err, res, conn);
  })
})

// update every field in the Customers table to the given json
// also update phone numbers
router.put('/:old_customer_ref', function (req, res) {
  let db_pool = req.app.get('db_pool');
  let c = req.body;
  let e_msg = "Err: PUT /api/customer -";
  db_pool.getConnection()
    .then(conn => {
      conn.beginTransaction()
        .then(() => {
          conn.query(`
            UPDATE Customer SET customer_ref = ?, firstname = ?, surname = ?, email = ?, company = ?, address_number = ?, address_street = ?, address_town = ?, address_postcode = ?
            WHERE customer_ref = ?
          `, [c.customer_ref, c.firstname,c.surname,c.email,c.company,c.address_number,c.address_street,c.address_town,c.address_postcode,req.params.old_customer_ref])
            .then((rows) => {
              if (rows.affectedRows > 0) {
                conn.query(`DELETE FROM Customer_Phone WHERE customer_ref = ?`, [req.params.old_customer_ref])
                  .then(() => {
                    conn.batch(`
                    INSERT INTO Customer_Phone (customer_ref, phone_number) VALUES (?, ?)
                    `, c.phone_numbers)
                      .then(() => {
                        conn.commit()
                          .then(() => {
                            conn.end();
                            res.json(c);
                          })
                          .catch((err) => {
                            util.handle_sql_error(`failed to commit transaction, no changes made`, e_msg, 500, err, res, conn);
                          })
                      })
                      .catch((err) => {
                        util.handle_sql_error(`inserting new phone numbers`, e_msg, 500, err, res, conn);
                      })
                  })
                  .catch((err) => {
                    util.handle_sql_error(`deleting old phone numbers`, e_msg, 500, err, res, conn);
                  })
              } else {
                  util.handle_sql_error(`updating customer ${req.params.old_customer_ref}, customer doesn't exist`, e_msg, 404, "none", res, conn);
              }
            })
            .catch((err) => {
              util.handle_sql_error(`updating customer`, e_msg, 500, err, res, conn);
            })
        })
        .catch((err) => {
          util.handle_sql_error(`creating transaction`, e_msg, 500, err, res, conn);
        })
    })
    .catch((err) => {
      util.handle_sql_error(`getting connetion from pool`, e_msg, 500, err, res, conn);
    })
})

// remove a customer from the database (cascade delete of orders etc?)
router.delete('/:customer_ref', function (req, res) {
  let db_pool = req.app.get('db_pool');
  let e_msg = `Err: DELETE /api/customer/${req.parans.customer_ref} -`;

  db_pool.getConnection()
    .then(conn => {
      conn.query(`
        DELETE FROM Customer WHERE customer_ref = ?
        `, [req.params.customer_ref])
        .then((rows) => {
          conn.end();
          if (rows.affectedRows < 1) {
            util.handle_sql_error(`customer ${req.params.customer_ref} does not exist`, e_msg, 404, "none", res, conn);
          } else {
            res.send("")
          }
        })
        .catch((err) => {
          util.handle_sql_error(`deleting customer`, e_msg, 500, err, res, conn);
        })
    })
    .catch((err) => {
      util.handle_sql_error(`getting connection from pool`, e_msg, 500, err, res, conn);
    })
})

// export to main js file
module.exports = router

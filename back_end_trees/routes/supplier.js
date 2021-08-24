const express = require('express');
const router = express.Router();
const util = require('../utilities');

// Middleware if we had any.
router.use(function (req, res, next) {
  next()
})

// Returns all suppliers with their phone numbers comma seperated
router.get('/', function (req, res) {
  let db_pool = req.app.get('db_pool');
  let e_msg = "Err: GET /api/supplier -";
  db_pool.getConnection()
    .then(conn => {
      conn.query(`
        SELECT s.*, GROUP_CONCAT(sp.phone_number) AS phone_numbers 
        FROM Supplier s
        LEFT JOIN Supplier_Phone sp ON
          s.supplier_code = sp.supplier_code
        GROUP BY s.supplier_code
        `)
        .then(rows => {
          conn.end();
          res.send(rows);
        })
        .catch(err => {
          util.handle_sql_error(`getting suppliers`, e_msg, 500, err, res, conn);
        })
      })
      .catch(err => {
        util.handle_sql_error(`getting connection from pool`, e_msg, 500, err, res, conn);
      })
})

// For a given supplier, return their details and all of their products
router.get('/:supplier_code', function (req, res) {
  let db_pool = req.app.get('db_pool');
  let e_msg = `Err: GET /api/supplier/${req.params.supplier_code} -`;

  // do stuff
})

// Add a new supplier, with phone numbers, using a transaction in case either insertion fails
router.post('/', function (req, res) {
  let db_pool = req.app.get('db_pool');
  let e_msg = "Err: POST /api/supplier -";
  let s = req.body
  db_pool.getConnection()
    .then(conn => {
      conn.beginTransaction()
        .then(() => {
          conn.query(`
            INSERT INTO Supplier (supplier_code, company_name, address_number,
            address_street, address_town, address_postcode, email)
            VALUES(?,?,?,?,?,?,?)
          `, [s.supplier_code, s.company_name, s.address_number, s.address_street, s.address_town, s.address_postcode, s.email])
            .then(() => {
              conn.batch(`
              INSERT INTO Supplier_Phone (supplier_code, phone_number) VALUES (?, ?)
              `, s.phone_numbers)
                .then(() => {
                  conn.commit();
                  conn.end();
                  res.json(s);
                })
                .catch((err) => {
                  util.handle_sql_error(`adding supplier, phone number insertsion failed`, e_msg, 500, err, res, conn);
                })
            })
            .catch((err) => {
              util.handle_sql_error(`adding supplier`, e_msg, 500, err, res, conn);
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

// update every field in the Supplier table to the given json
// also update phone numbers
router.put('/:old_supplier_code', function (req, res) {
  let db_pool = req.app.get('db_pool');
  let s = req.body;
  let e_msg = `Err: PUT /api/supplier/${req.params.old_supplier_code} -`;
  db_pool.getConnection()
    .then(conn => {
      conn.beginTransaction()
        .then(() => {
          conn.query(`
            UPDATE Supplier SET supplier_code=?, company_name=?, address_number=?,
            address_street=?, address_town=?, address_postcode=?, email=?
            WHERE supplier_code = ?
          `, [s.supplier_code, s.company_name, s.address_number, s.address_street, s.address_town, s.address_postcode, s.email, req.params.old_supplier_code])
            .then((rows) => {
              if (rows.affectedRows > 0) {
                conn.query(`DELETE FROM Supplier_Phone WHERE supplier_code = ?`, [req.params.old_supplier_code])
                  .then(() => {
                    conn.batch(`
                    INSERT INTO Supplier_Phone (supplier_code, phone_number) VALUES (?, ?)
                    `, s.phone_numbers)
                      .then(() => {
                        conn.commit()
                          .then(() => {
                            conn.end();
                            res.json(s);
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
                  util.handle_sql_error(`updating supplier ${req.params.old_supplier_code}, supplier doesn't exist`, e_msg, 404, "none", res, conn);
              }
            })
            .catch((err) => {
              util.handle_sql_error(`updating supplier`, e_msg, 500, err, res, conn);
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
router.delete('/:supplier_code', function (req, res) {
  let db_pool = req.app.get('db_pool');
  let e_msg = `Err: DELETE /api/supplier/${req.params.supplier_code} -`;

  db_pool.getConnection()
    .then(conn => {
      conn.query(`
        DELETE FROM Supplier WHERE supplier_code = ?
        `, [req.params.supplier_code])
        .then((rows) => {
          if (rows.affectedRows < 1) {
            util.handle_sql_error(`supplier ${req.params.supplier_code} does not exist`, e_msg, 404, "none", res, conn);
          } else {
            conn.end();
            res.send("")
          }
        })
        .catch((err) => {
          util.handle_sql_error(`deleting supplier`, e_msg, 500, err, res, conn);
        })
    })
    .catch((err) => {
      util.handle_sql_error(`getting connection from pool`, e_msg, 500, err, res, conn);
    })
})

// export to main js file
module.exports = router

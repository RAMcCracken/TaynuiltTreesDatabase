const express = require('express');
const router = express.Router();

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
          conn.end();
          console.log(`${e_msg} getting customers\n${err}`)
          res.status(500).send(`${e_msg} getting customers\n${err}`)
        })
      })
      .catch(err => {
            conn.end();
            console.log(`${e_msg} getting connection from pool\n${err}`)
            res.status(500).send(`${e_msg} getting connection from pool\n${err}`)
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
                  console.log(`${e_msg} adding customer, phone numbers failed\n${err}`);
                  conn.rollback();
                  conn.end();
                  res.status(500).send(`${e_msg} adding customer, phone numbers failed\n${err}`);
                })
            })
            .catch((err) => {
              console.log(`${e_msg} adding customer\n${err}`);
              conn.rollback();
              conn.end();
              res.status(500).send(`${e_msg} adding customer\n${err}`);
            })
      })
      .catch((err) => {
        console.log(`${e_msg} beginning transaction\n${err}`);
        conn.rollback();
        conn.end();
        res.status(500).send(`${e_msg} beginning transaction\n${err}`);
      })
  })
  .catch((err) => {
    console.log(`${e_msg} getting connection from pool\n${err}`);
    res.status(500).send(`${e_msg} getting connection from pool\n${err}`);
  })
})

// update every field in the Customers table to the given json
// also update phone numbers
router.put('/', function (req, res) {
  let db_pool = req.app.get('db_pool');
  let c = req.body;
  let e_msg = "Err: PUT /api/customer -";
  db_pool.getConnection()
    .then(conn => {
      conn.beginTransaction()
        .then(() => {
          conn.query(`
            UPDATE Customer SET customer_ref = ?firstname = ?, surname = ?, email = ?, company = ?, address_number = ?, address_street = ?, address_town = ?, address_postcode = ?
            WHERE customer_ref = ?
          `, [c.customer_ref, c.firstname,c.surname,c.email,c.company,c.address_number,c.address_street,c.address_town,c.address_postcode,c.customer_ref])
            .then((rows) => {
              if (rows.affectedRows > 0) {
                conn.query(`DELETE FROM Customer_Phone WHERE customer_ref = ?`, [c.customer_ref])
                  .then(() => {
                    conn.batch(`
                    INSERT INTO Customer_Phone (customer_ref, phone_number) VALUES (?, ?)
                    `, c.phone_numbers)
                      .then(() => {
                        console.log()
                        conn.commit()
                          .then(() => {
                            conn.end();
                            res.json(c);
                          })
                          .catch((err) => {
                            conn.end();
                            res.status(500).send(`${e_msg} failed to commit transaction\n${err}`);
                          })
                      })
                      .catch((err) => {
                        console.log(`${e_msg} inserting new phone numbers\n${err}`);
                        conn.rollback();
                        conn.end();
                        res.status(500).send(`${e_msg} inserting new phone numbers\n${err}`);
                      })
                  })
                  .catch((err) => {
                    console.log(`${e_msg} deleting old phone numbers\n${err}`);
                    conn.rollback();
                    conn.end();
                    res.status(500).send(`${e_msg} deleting old phone numbers\n${err}`);
                  })
              } else {
                  console.log(`${e_msg} updating customer, customer doesn't exist`);
                  conn.rollback();
                  conn.end();
                  res.status(404).send(`${e_msg} updating customer, customer doesn't exist`);
              }
            })
            .catch((err) => {
                console.log(`${e_msg} updating customer\n${err}`);
                conn.rollback();
                conn.end();
                res.status(500).send(`${e_msg} updating customer\n${err}`);
            })
        })
        .catch((err) => {
          conn.end();
          console.log(`${e_msg} creating transaction\n${err}`);
          res.status(500).send(`${e_msg} creating transaction\n${err}`);
        })
    })
    .catch((err) => {
      console.log(`${e_msg} getting connection from pool\n${err}`);
      res.status(500).send(`${e_msg} getting connection from pool\n${err}`);
    })
})

// remove a customer from the database (cascade delete of orders etc?)
router.delete('/:customer_ref', function (req, res) {
  let db_pool = req.app.get('db_pool');
  let e_msg = "Err: DELETE /api/customer -";

  db_pool.getConnection()
    .then(conn => {
      conn.query(`
        DELETE FROM Customer WHERE customer_ref = ?
        `, [req.params.customer_ref])
        .then((rows) => {
          conn.end();
          if (rows.affectedRows < 1) {
            res.status(404).send(`${e_msg} customer ${req.params.customer_ref} does not exist`)
          } else {
            res.status(200).send("")
          }
        })
        .catch((err) => {
          conn.end();
          console.log(`${e_msg} deleting customer\n${err}`);
          res.status(500).send(`${e_msg} deleting customer\n${err}`);
        })
    })
    .catch((err) => {
      conn.end();
      console.log(`${e_msg} getting connection from pool\n${err}`);
      res.status(500).send(`${e_msg} getting connection from pool\n${err}`);
    })
})

// export to main js file
module.exports = router

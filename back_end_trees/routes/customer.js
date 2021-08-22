const express = require('express');
const router = express.Router();

// Middleware if we had any.
router.use(function (req, res, next) {
  next()
})

// Returns all customers with their phone numbers comma seperated
router.get('/', function (req, res) {
  let db_pool = req.app.get('db_pool');
  db_pool.getConnection()
    .then(conn => {
      conn.query(`
        SELECT 
          CONCAT_WS(' ', c.firstname, c.surname) AS full_name,
          c.customer_ref, c.email, c.company,
          CONCAT_WS(', ', c.address_number, c.address_street,
            c.address_town, c.address_postcode) AS full_address,
          GROUP_CONCAT(cp.phone_number) AS phone_numbers 
        FROM Customer c
        LEFT JOIN Customer_Phone cp ON
          c.customer_ref = cp.customer_ref
        GROUP BY c.customer_ref
        `)
        .then(rows => {
          res.send(rows);
          conn.end();
        })
        .catch(err => {
          console.log(err)
          res.send(err)
        })
      })
    .catch(err => {
      console.log(err)
      res.send(err)
    })
})

// Add a new customer, with phone numbers, using a transaction in case either insertion fails
router.post('/', async function (req, res) {
  let db_pool = req.app.get('db_pool');
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
                  res.json(c);
                })
                .catch((err) => {
                  console.log(err);
                  conn.rollback();
                  res.status(400);
                  res.send(err);
                })
            })
            .catch((err) => {
              console.log(err);
              conn.rollback();
              res.status(400);
              res.send(err);
            })
      })
      .catch((err) => {
        console.log(err);
        conn.rollback();
        res.status(400);
        res.send(err);
      })
  })
})

// update every field in the Customers table to the given json
// also update phone numbers
router.put('/', function (req, res) {
  res.send('customer put')
})

// remove a customer from the database (cascade delete of orders etc?)
router.delete('/', function (req, res) {
  let db_pool = req.app.get('db_pool');
  let c = req.body
  db_pool.getConnection()
    .then(conn => {
      conn.query(``)
    })
})

// export to main js file
module.exports = router

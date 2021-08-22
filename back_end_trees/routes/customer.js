const express = require('express');
const router = express.Router();

// TODO: GET POST PUT DELETE Queries on Customer

// Middleware if we had any.
router.use(function (req, res, next) {
  next()
})

// Returns all customers with their phone numbers comma seperated
router.get('/', function (req, res) {
  let conn
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

          //  conn.query(`
          //    INSERT INTO Customer (customer_ref, firstname, surname,
          //      email, company, address_number, address_street, address_town,
          //      address_postcode) 
          //    VALUES(?,?,?,?,?,?,?,?,?)
          //    `), [c.customer_ref,c.firstname,c.surname,c.email,c.company,c.address_number,c.address_street,c.address_town,c.address_postcode], (err) => {
            //
//              conn.batch(`
//                INSERT INTO Customer_Phone phone_number, customer_ref VALUES (?, ?)
//                `), c.phone_numbers, (err) => {
//                  if (err) {
router.post('/', async function (req, res) {
  let conn
  let db_pool = req.app.get('db_pool');
  try {
    conn = await db_pool.getConnection()

    conn.beginTransaction(async err => {
      if (err) {console.log("Err making trans")}
      else {
        rows = await conn.query("SELECT * FROM Customer")
        console.log(rows)
      }
    })

  } catch (err) {
    res.status(400)
    res.send(err)
  } finally {
    if (conn) conn.end();
  }
})

router.put('/', function (req, res) {
  res.send('customer put')
})
router.delete('/', function (req, res) {
  res.send('customer delete')
})

module.exports = router

const express = require('express');
const router = express.Router();

// TODO: GET POST PUT DELETE Queries on Customer

// GET - Concanenate name. And also address
/*
 * customer_ref (varchar)
 * firstname
 * surname
 * email
 * company
 * address_number
 * address_street
 * address_town
 * address_postcode
 */

// Middleware if we had any.
router.use(function (req, res, next) {
  next()
})

// Returns all customers with their phone numbers comma seperated
router.get('/', async function (req, res) {
  let conn
  let db_pool = req.app.get('db_pool');
  try {
    conn = await db_pool.getConnection()
    const rows = await conn.query(`
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
    res.send(rows)
  } catch (err) {
    res.send(err)
  } finally {
    if (conn) conn.end();
  }
})
router.post('/', function (req, res) {
  res.send('customer post')
})
router.put('/', function (req, res) {
  res.send('customer put')
})
router.delete('/', function (req, res) {
  res.send('customer delete')
})

module.exports = router

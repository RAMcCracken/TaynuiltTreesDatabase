const express = require('express');
const router = express.Router();

// on a given order, associated order products in order products
// also associated invoices with invoice products
// also deliveries associated with invoices
//
// On orders, 

// GET all orders/data, get sep query to get all order products given order.
// GET order/:id - get invoices and order (maybe just invoices?)
// Might want to show
// POST ORDER, order products and order, use transaction

// Middleware if we had any.
router.use(function (req, res, next) {
  next()
})

// GET all orders
router.get('/', function (req, res) {
  let db_pool = req.app.get('db_pool');
  let e_msg = "Err: GET /api/customer -";
  db_pool.getConnection()
    .then(conn => {
      conn.query(`
        SELECT * FROM Orders
        `)
        .then(rows => {
          conn.end();
          res.send(rows);
        })
        .catch(err => {
          conn.end();
          console.log(`${e_msg} getting orders\n${err}`)
          res.status(500).send(`${e_msg} getting orders\n${err}`)
        })
      })
      .catch(err => {
            conn.end();
            console.log(`${e_msg} getting connection from pool\n${err}`)
            res.status(500).send(`${e_msg} getting connection from pool\n${err}`)
      })
})

// GET a order by :order_ref.
// Return all ass order_products, invoices, and each invoices ass products.
// order: {order_products: [], invoices: {[data: foo, invoice_products: []]}}



// export to main js file
module.exports = router

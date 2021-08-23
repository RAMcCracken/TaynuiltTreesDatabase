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
  let e_msg = "Err: GET /api/order -";
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
// order: {order_products: [], invoices: [data: foo, invoice_products: []]}
router.get('/:order_no', function (req, res) {
  let order_no = req.params.order_no;
  let db_pool = req.app.get('db_pool');
  let e_msg = `Err: GET /api/order/${order_no} -`;
  db_pool.getConnection()
    .then(conn => {
      conn.query(`
        SELECT * FROM Orders WHERE order_no = ?
        `, [order_no])
        .then(rows => {
          // orders: {order: {foo}}
          delete rows.meta;
          order = {order: rows[0]}
        })
          .then(() => {
            // get ass order prod
            conn.query(`
              SELECT * FROM Order_Products WHERE order_no = ?
              `, [order_no])
              .then(rows => {
                // orders: {order: {food}, order_ass_prod: [{foo}]}
                delete rows.meta;
                order.order_ass_prod = rows;
              })
              .then(() => {
                conn.query(`
                  SELECT * FROM Invoice WHERE order_no = ?
                  `, [order_no])
                  .then(rows => {
                    // orders: {order: {food}, order_ass_prod: [{foo}], invoices: [{}]}
                    delete rows.meta;
                    order.invoices = rows;
                  })
                  .then(() => {
                    let new_invoices = order.invoices.map(invoice => {
                      return conn.query(`
                        SELECT * FROM Invoice_Products WHERE invoice_no = ?
                        `, [invoice.invoice_no])
                        .then(rows => {
                          delete rows.meta;
                          invoice.invoice_ass_prod = rows
                          return invoice
                        })
                        .catch(err => {
                          conn.end();
                          console.log(`${e_msg} getting invoice ass products\n${err}`)
                          res.status(500).send(`${e_msg} getting invoice ass products\n${err}`)
                        })
                    })
                    // map returns an array of promises that we have to resolve
                    Promise.all(new_invoices).then(invoices => {
                      order.invoices = invoices
                    }).then(() => {
                      conn.end();
                      res.send(order)
                    }).catch((err) => {
                      conn.end();
                      console.log(`${e_msg} getting order\n${err}`)
                      res.status(500).send(`${e_msg} getting order\n${err}`)
                    })
                  })
              })
              .catch(err => {
                conn.end();
                console.log(`${e_msg} getting invoices\n${err}`)
                res.status(500).send(`${e_msg} getting invoices\n${err}`)
              })
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



// export to main js file
module.exports = router

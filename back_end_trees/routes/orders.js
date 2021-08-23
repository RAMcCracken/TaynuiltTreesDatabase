const express = require('express');
const router = express.Router();

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
                      conn.end();
                      res.send(order)
                    }).catch((err) => {
                      conn.end();
                      console.log(`${e_msg} resolving nested invoice products\n${err}`)
                      res.status(500).send(`${e_msg} resolving invoice products\n${err}`)
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

// add order
router.post('/', function (req, res) {
  let db_pool = req.app.get('db_pool');
  let o = req.body;
  let e_msg = "Err: POST /api/order -";
  db_pool.getConnection().then(conn => {
    conn.query(`
      INSERT INTO Orders (order_no, order_date, credit_period, picked, location, stock_reserve, Customer_PO, quote_ref, customer_ref) VALUES (?,?,?,?,?,?,?,?,?)`, [o.order_no,o.order_date,o.credit_period,o.picked,o.location,o.stock_reserve,o.Customer_PO,o.quote_ref,o.customer_ref]).then(() => {
        conn.close();
        res.send(o);
      }).catch(err => {
        conn.end();
        console.log(`${e_msg} adding order\n${err}`)
        res.status(500).send(`${e_msg} adding order\n${err}`)
      })
  }).catch(err => {
    conn.end();
    console.log(`${e_msg} getting connection from pool\n${err}`)
    res.status(500).send(`${e_msg} getting connection from pool\n${err}`)
  });
})

// edit order?
router.put('/:old_order_no', function (req, res) {
  console.log(req.params.old_order_no)
  let db_pool = req.app.get('db_pool');
  let o = req.body;
  let e_msg = "Err: PUT /api/order -";
  db_pool.getConnection().then(conn => {
      //UPDATE Orders SET order_no = ?, order_date = ?, credit_period = ?, picked = ?, location = ?, stock_reserve = ?, Customer_PO = ?, quote_ref = ?, customer_ref = ?
      //WHERE order_no = ?
    conn.query(`
      UPDATE taynuilttrees.Orders o
      SET o.picked=?,o.credit_period=?,o.Customer_PO=?,o.order_no=?,o.customer_ref=?,o.order_date=?,o.location=?,o.quote_ref=?,o.stock_reserve=?
      WHERE o.order_no=?
      LIMIT 1

      `, //[o.order_no,o.order_date,o.credit_period,o.picked,o.location,o.stock_reserve,o.Customer_PO,o.quote_ref,o.customer_ref,req.params.old_order_no]).then(rows => {
      [o.picked,o.credit_period,o.Customer_PO,o.order_no,o.customer_ref,o.order_date,o.location,o.quote_ref,o.stock_reserve,req.params.old_order_no]).then(rows => {
        if (rows.affectedRows !== 1) {
          conn.end();
          console.log(rows)
          console.log(`${e_msg} editing order ${req.params.old_order_no}, doesn't exist`)
          console.log(rows.affectedRows)
          res.status(404).send(`${e_msg} editing order ${req.params.old_order_no}, doesn't exist`)
        } else {
          conn.close();
          res.send(o);
        }
      }).catch(err => {
        conn.end();
        console.log(`${e_msg} editing order\n${err}`)
        res.status(500).send(`${e_msg} editing order\n${err}`)
      })
  }).catch(err => {
    conn.end();
    console.log(`${e_msg} getting connection from pool\n${err}`)
    res.status(500).send(`${e_msg} getting connection from pool\n${err}`)
  });
})

// delete order
router.delete('/:order_no', function (req, res) {
  let db_pool = req.app.get('db_pool');
  let e_msg = "Err: DELETE /api/order -";
  db_pool.getConnection().then(conn => {
    conn.query(`
      DELETE FROM Orders WHERE order_no = ?
      `, [req.params.order_no]).then((rows) => {
        if (rows.affectedRows !== 1) {
          conn.end();
          console.log(`${e_msg} deleting order, doesn't exist`)
          res.status(500).send(`${e_msg} deleting order, doesn't exist`)
        } else {
          conn.close();
          res.send("");
        }
      }).catch(err => {
        conn.end();
        console.log(`${e_msg} editing order\n${err}`)
        res.status(500).send(`${e_msg} editing order\n${err}`)
      })
  }).catch(err => {
    conn.end();
    console.log(`${e_msg} getting connection from pool\n${err}`)
    res.status(500).send(`${e_msg} getting connection from pool\n${err}`)
  });
})

// export to main js file
module.exports = router

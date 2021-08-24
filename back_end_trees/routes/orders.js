const express = require('express');
const router = express.Router();
const util = require('../utilities');

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
          util.handle_sql_error('getting orders', e_msg, 500, err, res, conn);
        })
      })
      .catch(err => {
          util.handle_sql_error('getting connection from pool', e_msg, 500, err, res, conn);
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
                          util.handle_sql_error('getting invoice ass products', e_msg, 500, err, res, conn);
                        })
                    })
                    // map returns an array of promises that we have to resolve
                    Promise.all(new_invoices).then(invoices => {
                      order.invoices = invoices
                      conn.end();
                      res.send(order)
                    }).catch((err) => {
                      util.handle_sql_error('resolving nested invoice products', e_msg, 500, err, res, conn);
                    })
                  })
              })
              .catch(err => {
                util.handle_sql_error('getting invoices', e_msg, 500, err, res, conn);
              })
          })
        .catch(err => {
          util.handle_sql_error('getting orders', e_msg, 500, err, res, conn);
        })
      })
      .catch(err => {
            util.handle_sql_error('getting connection from pool', e_msg, 500, err, res, conn);
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
          util.handle_sql_error('adding order', e_msg, 500, err, res, conn);
      })
  }).catch(err => {
      util.handle_sql_error('getting connection from pool', e_msg, 500, err, res, conn);
  });
})

// edit order
router.put('/:old_order_no', function (req, res) {
  console.log(req.params.old_order_no)
  let db_pool = req.app.get('db_pool');
  let o = req.body;
  let e_msg = "Err: PUT /api/order -";
  db_pool.getConnection().then(conn => {
    conn.query(`
      UPDATE taynuilttrees.Orders o
      SET o.picked=?,o.credit_period=?,o.Customer_PO=?,o.order_no=?,o.customer_ref=?,o.order_date=?,o.location=?,o.quote_ref=?,o.stock_reserve=?
      WHERE o.order_no=?
      LIMIT 1

      `, //[o.order_no,o.order_date,o.credit_period,o.picked,o.location,o.stock_reserve,o.Customer_PO,o.quote_ref,o.customer_ref,req.params.old_order_no]).then(rows => {
      [o.picked,o.credit_period,o.Customer_PO,o.order_no,o.customer_ref,o.order_date,o.location,o.quote_ref,o.stock_reserve,req.params.old_order_no]).then(rows => {
        if (rows.affectedRows !== 1) {
          util.handle_sql_error(`editing order ${req.params.old_order_no}, doesn't exist`, e_msg, 404, err, res, conn);
        } else {
          conn.close();
          res.send(o);
        }
      }).catch(err => {
          util.handle_sql_error(`editing order`, e_msg, 500, err, res, conn);
      })
  }).catch(err => {
      util.handle_sql_error(`getting connection from pool`, e_msg, 500, err, res, conn);
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
          util.handle_sql_error(`deleting order ${req.params.order_no}, doesn't exist`, e_msg, 404, err, res, conn);
        } else {
          conn.close();
          res.send("");
        }
      }).catch(err => {
          util.handle_sql_error(`deleting order`, e_msg, 500, err, res, conn);
      })
  }).catch(err => {
      util.handle_sql_error(`getting connection from pool`, e_msg, 500, err, res, conn);
  });
})

// Add / Edit an orders order products via transaction deleting
// them all, then adding in the ones given.
// expects => [[order_no,product_code,bags,quantity]]
router.put('/:order_no/product', function (req, res) {
  let db_pool = req.app.get('db_pool');
  let e_msg = `Err: PUT /api/order/${req.params.order_no}/product -`;

  db_pool.getConnection().then(conn => {
    conn.beginTransaction().then(() => {
      conn.query(`
        DELETE FROM Order_Products WHERE order_no = ?
        `, [req.params.order_no]).then(() => {
          conn.batch(`
           INSERT INTO Order_Products (order_no, product_code, bags, quantity) VALUES (?,?,?,?)  
            `, req.body.order_prod).then(rows => {
              conn.commit();
              conn.end();
              res.send(`Added ${rows.affectedRows} products to database`);
            }).catch(err => {
                util.handle_sql_error(`adding order products`, e_msg, 500, err, res, conn);
            })
        }).catch(err => {
            util.handle_sql_error(`deleting existing order products`, e_msg, 500, err, res, conn);
        })
    }).catch(err => {
        util.handle_sql_error(`starting transaction`, e_msg, 500, err, res, conn);
    })
  }).catch(err => {
      util.handle_sql_error(`getting connection from pool`, e_msg, 500, err, res, conn);
  })
})

// export to main js file
module.exports = router

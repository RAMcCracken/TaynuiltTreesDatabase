const express = require('express');
const router = express.Router();
const util = require('../utilities');

// Middleware if we had any.
router.use(function (req, res, next) {
  next()
})

// GET all invoices
router.get('/', function (req, res) {
  let db_pool = req.app.get('db_pool');
  let e_msg = "Err: GET /api/invoice -";
  db_pool.getConnection()
    .then(conn => {
      conn.query(`
        SELECT * FROM Invoice
        `)
        .then(rows => {
          conn.end();
          res.send(rows);
        })
        .catch(err => {
          util.handle_sql_error('getting invoices', e_msg, 500, err, res, conn);
        })
    })
    .catch(err => {
      util.handle_sql_error('getting connection from pool', e_msg, 500, err, res, conn);
    })
})

// GET single invoice
router.get('/:invoice_no', function (req, res) {
  let db_pool = req.app.get('db_pool');
  let e_msg = `Err: GET /api/invoice/${req.params.invoice_no} -`;
  db_pool.getConnection()
    .then(conn => {
      conn.query(`
        SELECT * FROM Invoice WHERE invoice_no=?
        `, [req.params.invoice_no])
        .then(rows => {
          if (rows.length !== 1) {
            util.handle_sql_error(`getting invoice ${req.params.invoice_no}, doesn't exist`, e_msg, 404, "none", res, conn);
          } else {
            conn.end();
            res.send(rows[0]);
          }
        })
        .catch(err => {
          util.handle_sql_error(`getting invoice ${req.params.invoice_no}`, e_msg, 500, err, res, conn);
        })
    })
    .catch(err => {
      util.handle_sql_error('getting connection from pool', e_msg, 500, err, res, conn);
    })
})

// GET a detailed invoice by :invoice_no.
// Return all ass_quote_products
router.get('/:invoice_no/detailed', function (req, res) {
  let invoice_no = req.params.invoice_no;
  let db_pool = req.app.get('db_pool');
  let e_msg = `Err: GET /api/invoice/${invoice_no}/detailed -`;
  db_pool.getConnection()
    .then(conn => {
      conn.query(`
        SELECT * FROM Invoice WHERE invoice_no = ?
        `, [invoice_no])
        .then(rows => {
          if (rows.length !== 1) {
            throw "invoice not found"
          }
          invoice = { invoice: rows[0] }
        })
        .then(() => {
          // get ass invoice prod
          conn.query(`
              SELECT * FROM Invoice_Products WHERE invoice_no = ?
              `, [invoice_no])
            .then(rows => {
              invoice.invoice_ass_prod = rows;
              conn.end();
              res.send(invoice);
            })
        })
        .catch(err => {
          util.handle_sql_error('getting invoice', e_msg, 500, err, res, conn);
        })
    })
    .catch(err => {
      util.handle_sql_error('getting connection from pool', e_msg, 500, err, res, conn);
    })
})

// POST new invoice
router.post('/', function (req, res) {
  let db_pool = req.app.get('db_pool');
  let i = req.body
  let e_msg = "Err: POST /api/invoice -";

  db_pool.getConnection().then(conn => {
    conn.query(`
      INSERT INTO Invoice (invoice_no, invoice_date, discount, vat, payment_method, paid, date_paid, order_no, delivery_ref) VALUES (?,?,?,?,?,?,?,?,?)
      `, [i.invoice_no, i.invoice_date, i.discount, i.vat, i.payment_method, i.paid, i.date_paid, i.order_no, i.delivery_ref]).then(() => {
      conn.end();
      res.send(i);
    }).catch(err => {
      util.handle_sql_error('adding invoice', e_msg, 500, err, res, conn);
    })
  }).catch(err => {
    util.handle_sql_error('getting connection from pool', e_msg, 500, err, res, conn);
  })
})

// PUT update invoice
router.put('/:invoice_no', function (req, res) {
  let db_pool = req.app.get('db_pool');
  let e_msg = `Err: PUT /api/invoice/${req.params.invoice_no} -`;

  db_pool.getConnection().then(conn => {
    conn.query(`
      UPDATE Invoice SET invoice_no=?, invoice_date=?, discount=?, vat=?, payment_method=?, paid=?, date_paid=?, order_no=?, delivery_ref=? VALUES (?,?,?,?,?,?,?,?,?)
      WHERE invoice_no=?
      `, [i.invoice_no, i.invoice_date, i.discount, i.vat, i.payment_method, i.paid, i.date_paid, i.order_no, i.delivery_ref, req.params.invoice_no]).then(rows => {
      if (rows.affectedRows !== 1) {
        util.handle_sql_error(`updating invoice ${req.params.invoice_no}, invoice doesn't exist`, e_msg, 404, "none", res, conn);
      } else {
        conn.end();
        res.send(i);
      }
    }).catch(err => {
      util.handle_sql_error('editing invoice', e_msg, 500, err, res, conn);
    })
  }).catch(err => {
    util.handle_sql_error('getting connection from pool', e_msg, 500, err, res, conn);
  })
})

// DELETE invoice
router.delete('/:invoice_no', function (req, res) {
  let db_pool = req.app.get('db_pool');
  let e_msg = `Err: DELETE /api/invoice/${req.params.invoice_no} -`;

  db_pool.getConnection().then(conn => {
    conn.query(`
      DELETE FROM Invoice WHERE invoice_no = ?
      `, [req.params.invoice_no]).then((rows) => {
      if (rows.affectedRows !== 1) {
        util.handle_sql_error(`deleting invoice ${req.params.invoice_no}, doesn't exist`, e_msg, 404, "none", res, conn);
      } else {
        conn.close();
        res.send("");
      }
    }).catch(err => {
      util.handle_sql_error(`deleting invoice`, e_msg, 500, err, res, conn);
    })
  }).catch(err => {
    util.handle_sql_error(`getting connection from pool`, e_msg, 500, err, res, conn);
  });
})

// POST an invoice product
router.post(`/:invoice_no/product`, function (req, res) {
  let db_pool = req.app.get('db_pool');
  let e_msg = `Err: POST /api/invoice/${req.params.invoice_no}/product -`;
  let i = req.body;

  db_pool.getConnection().then(conn => {
    conn.query(`
      INSERT INTO Invoice_Products (invoice_no, product_code, bags, quantity)
      VALUES (?,?,?,?)
      `, [i.invoice_no, i.product_code, i.bags, i.quantity,]).then(() => {
      conn.end();
      res.send(i);
    }).catch(err => {
      util.handle_sql_error(`adding invoice product`, e_msg, 500, err, res, conn);
    })
  }).catch(err => {
    util.handle_sql_error(`getting connection from pool`, e_msg, 500, err, res, conn);
  })
})

// PUT update an invoice product
router.put('/:old_invoice_no/product/:old_product_code', function (req, res) {
  let db_pool = req.app.get('db_pool');
  let e_msg = `Err: PUT /api/invoice/${req.params.old_invoice_no}/product/${req.params.old_product_code} -`;
  let i = req.body;

  db_pool.getConnection().then(conn => {
    conn.query(`
      UPDATE Invoice_Products SET invoice_no=?,product_code=?,bags=?,quantity=?
      WHERE invoice_no=? AND product_code=?
      `, [i.invoice_no, i.product_code, i.bags, i.quantity, req.params.old_invoice_no, req.params.old_product_code])
      .then(rows => {
        if (rows.affectedRows !== 1) {
          util.handle_sql_error(`updating invoice product ${req.params.old_invoice_no}/${req.params.old_product_code}, doesn't exist`, e_msg, 404, "none", res, conn);
        } else {
          conn.end();
          res.send(i);
        }
      })
      .catch(err => {
        util.handle_sql_error(`updating invoice product`, e_msg, 500, err, res, conn);
      })
  }).catch(err => {
    util.handle_sql_error(`getting connection from pool`, e_msg, 500, err, res, conn);
  })
})

// DELETE invoice product
router.delete('/:invoice_no/product/:product_code', function (req, res) {
  let db_pool = req.app.get('db_pool');
  let e_msg = `Err: DELETE /api/invoice/${req.params.invoice_no}/product/${req.params.product_code} -`;

  db_pool.getConnection().then(conn => {
    conn.query(`
      DELETE FROM Invoice_Products WHERE invoice_no=? AND product_code=?
      `, [req.params.invoice_no, req.params.product_code]).then(rows => {
      if (rows.affectedRows !== 1) {
        util.handle_sql_error(`deleting invoice product ${req.params.invoice_no}/${req.params.product_code}, doesn't exist`, e_msg, 404, "none", res, conn);
      } else {
        conn.end();
        res.send("");
      }
    }).catch(err => {
      util.handle_sql_error('deleting invoice product', e_msg, 500, err, res, conn);
    })
  }).catch(err => {
    util.handle_sql_error('getting connection from pool', e_msg, 500, err, res, conn);
  })
})
// export to main js file
module.exports = router

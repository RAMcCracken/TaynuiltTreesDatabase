const express = require('express');
const router = express.Router();
const util = require('../utilities');

// Middleware if we had any.
router.use(function (req, res, next) {
  next()
})

// POST new invoice
router.post('/', function (req, res) {
  let db_pool = req.app.get('db_pool');
  let i = req.body
  let e_msg = "Err: POST /api/invoice -";

  db_pool.getConnection().then(conn => {
    conn.query(`
      INSERT INTO Invoice (invoice_no, invoice_date, discount, vat, payment_method, paid, date_paid, order_no, delivery_ref) VALUES (?,?,?,?,?,?,?,?,?)
      `,[i.invoice_no,i.invoice_date,i.discount,i.vat,i.payment_method,i.paid,i.date_paid,i.order_no,i.delivery_ref]).then(() => {
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
      `,[i.invoice_no,i.invoice_date,i.discount,i.vat,i.payment_method,i.paid,i.date_paid,i.order_no,i.delivery_ref,req.params.invoice_no]).then(rows => {
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
router.put('/:invoice_no', function (req, res) {
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

// PUT update an invoice product
router.put('/:old_invoice_no/product/:old_product_code', function (req, res) {
  let db_pool = req.app.get('db_pool');
  let e_msg = `Err: PUT /api/invoice/${req.params.old_invoice_no}/product/${req.params.old_product_code} -`;
  let i = req.body;

  db_pool.getConnection().then(conn => {
    conn.query(`
      UPDATE Invoice_Products SET invoice_no=?,product_code=?,bags=?,quantity=?
      WHERE invoice_no=? AND product_code=?
      `,[i.invoice_no,i.product_code,i.bags,i.quantity,req.params.old_invoice_no,req.params.old_product_code])
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

// export to main js file
module.exports = router

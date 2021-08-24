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
          util.handle_sql_error(`updating invoice ${req.params.invoice_no}, invoice doesn't exist`, e_msg, 404, err, res, conn);
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
})

// PUT invoice_products
router.put('/:invoice_no/product', function (req, res) {
  let db_pool = req.app.get('db_pool');
  let e_msg = `Err: DELETE /api/invoice/${req.params.invoice_no}/product -`;
})

// export to main js file
module.exports = router

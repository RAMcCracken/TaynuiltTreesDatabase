const express = require('express');
const router = express.Router();

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
        conn.end();
        console.log(`${e_msg} adding invoice\n${err}`)
        res.status(500).send(`${e_msg} adding invoice\n${err}`)
      })
  }).catch(err => {
    conn.end();
    console.log(`${e_msg} getting connection from pool\n${err}`)
    res.status(500).send(`${e_msg} getting connection from pool\n${err}`)
  })
})

// PUT update invoice
router.put('/:invoice_no', function (req, res) {
  let db_pool = req.app.get('db_pool');
  let e_msg = `Err: PUT /api/invoice/${req.params.invoice_no} -`;
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

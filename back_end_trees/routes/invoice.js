const express = require('express');
const router = express.Router();

// Middleware if we had any.
router.use(function (req, res, next) {
  next()
})

// POST new invoice
router.post('/', function (req, res) {
  let db_pool = req.app.get('db_pool');
  let e_msg = "Err: POST /api/invoice -";
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

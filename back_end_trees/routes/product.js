const express = require('express');
const router = express.Router();
const util = require('../utilities');

// Middleware if we had any.
router.use(function (req, res, next) {
  next()
})

// GET all products
router.get('/', function (req, res) {
  let db_pool = req.app.get('db_pool');
  let e_msg = "Err: GET /api/product -";

  db_pool.getConnection().then(conn => {
    conn.query(`SELECT * FROM Product`).then(rows => {
      conn.end();
      res.send(rows);
    }).catch(err => {
      util.handle_sql_error('getting all products', e_msg, 500, err, res, conn);
    })
  }).catch(err => {
      util.handle_sql_error('getting connection from pool', e_msg, 500, err, res, conn);
  })
})

// GET single quote by product_code
router.get('/:product_code', function (req, res) {
  let db_pool = req.app.get('db_pool');
  let e_msg = `Err: GET /api/product/${req.params.product_code} -`;

  db_pool.getConnection().then(conn => {
    conn.query(`SELECT * FROM Product WHERE product_code=?`,[req.params.product_code]).then(rows => {
      if (rows.length !== 1) {
        util.handle_sql_error(`getting product ${req.params.product_code}, doesn't exist`, e_msg, 404, "none", res, conn);
      } else {
        conn.end();
        res.send(rows[0]);
      }
    }).catch(err => {
      util.handle_sql_error('single product', e_msg, 500, err, res, conn);
    })
  }).catch(err => {
      util.handle_sql_error('getting connection from pool', e_msg, 500, err, res, conn);
  })
})

// POST new product
router.post('/', function (req, res) {
  let db_pool = req.app.get('db_pool');
  let e_msg = "Err: POST /api/product -";
  let p = req.body;

  db_pool.getConnection().then(conn => {
    conn.query(`
      INSERT INTO Product (product_code, description, size, age, master_certificate, 
      toBM, cat, origin, prov_zone, alt, collection_site, veg_prop, notes,
      species_code, price_code, supplier_code)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      `,[p.product_code, p.description, p.size, p.age, p.master_certificate, p.toBM, p.cat, p.origin, p.prov_zone, p.alt, p.collection_site, p.veg_prop, p.notes, p.species_code, p.price_code, p.supplier_code]).then(rows => {
        if (rows.affectedRows !== 1) {
          util.handle_sql_error('inserting product', e_msg, 500, "none", res, conn);
        } else {
          conn.end();
          res.send(p);
        }
      }).catch(err => {
        util.handle_sql_error('inserting product', e_msg, 500, err, res, conn);
      })
  }).catch(err => {
      util.handle_sql_error('getting connection from pool', e_msg, 500, err, res, conn);
  })
})

// PUT update product
router.put('/:old_product_code', function (req, res) {
  let db_pool = req.app.get('db_pool');
  let e_msg = `Err: PUT /api/product/${req.params.old_product_code} -`;
  let p = req.body;

  db_pool.getConnection().then(conn => {
    conn.query(`
      UPDATE Product SET product_code=?, description=?, size=?, age=?, master_certificate=?, 
      toBM=?, cat=?, origin=?, prov_zone=?, alt=?, collection_site=?, veg_prop=?, notes=?,
      species_code=?, price_code=?, supplier_code=? WHERE product_code=?
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      `,[p.product_code, p.size, p.age, p.master_certificate, p.toBM, p.cat, p.origin, p.prov_zone, p.alt, p.collection_site, p.veg_prop, p.notes, p.species_code, p.price_code, p.supplier_code, req.params.old_product_code]).then(rows => {
        if (rows.affectedRows !== 1) {
          util.handle_sql_error(`updating product ${req.params.old_product_code}, doesn't exist`, e_msg, 404, "none", res, conn);
        } else {
          conn.end();
          res.send(p);
        }
      }).catch(err => {
        util.handle_sql_error('updating product', e_msg, 500, err, res, conn);
      })
  }).catch(err => {
      util.handle_sql_error('getting connection from pool', e_msg, 500, err, res, conn);
  })
})

// DELETE product
router.delete('/:product_code', function (req, res) {
  let db_pool = req.app.get('db_pool');
  let e_msg = `Err: DELETE /api/product/${req.params.product_code} -`;

  db_pool.getConnection().then(conn => {
    conn.query(`
      DELETE FROM Product WHERE product_code=?
      `,[req.params.product_code]).then(rows => {
        if (rows.affectedRows !== 1) {
          util.handle_sql_error(`deleting product ${req.params.product_code}, doesn't exist`, e_msg, 404, "none", res, conn);
        } else {
          conn.end();
          res.send("");
        }
      }).catch(err => {
        util.handle_sql_error('deleting product', e_msg, 500, err, res, conn);
      })
  }).catch(err => {
      util.handle_sql_error('getting connection from pool', e_msg, 500, err, res, conn);
  })
})

module.exports = router

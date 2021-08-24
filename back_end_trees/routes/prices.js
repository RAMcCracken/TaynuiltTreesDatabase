const express = require('express');
const router = express.Router();
const util = require('../utilities');

// Middleware if we had any.
router.use(function (req, res, next) {
  next()
})

// GET all price
router.get('/', function (req, res) {
  let db_pool = req.app.get('db_pool');
  let e_msg = "Err: GET /api/price -";

  db_pool.getConnection().then(conn => {
    conn.query(`SELECT * FROM Prices`).then(rows => {
      conn.end();
      res.send(rows);
    }).catch(err => {
      util.handle_sql_error('getting all prices', e_msg, 500, err, res, conn);
    })
  }).catch(err => {
      util.handle_sql_error('getting connection from pool', e_msg, 500, err, res, conn);
  })
})

// GET single quote by price_code
router.get('/:price_code', function (req, res) {
  let db_pool = req.app.get('db_pool');
  let e_msg = `Err: GET /api/price/${req.params.price_code} -`;

  db_pool.getConnection().then(conn => {
    conn.query(`SELECT * FROM Prices WHERE price_code=?`,[req.params.price_code]).then(rows => {
      if (rows.length !== 1) {
        util.handle_sql_error(`getting price ${req.params.price_code}, doesn't exist`, e_msg, 404, err, res, conn);
      } else {
        conn.end();
        res.send(rows);
      }
    }).catch(err => {
      util.handle_sql_error('single price', e_msg, 500, err, res, conn);
    })
  }).catch(err => {
      util.handle_sql_error('getting connection from pool', e_msg, 500, err, res, conn);
  })
})

// POST new price
router.post('/', function (req, res) {
  let db_pool = req.app.get('db_pool');
  let e_msg = "Err: POST /api/price -";
  let p = req.body;

  db_pool.getConnection().then(conn => {
    conn.query(`
      INSERT INTO Prices (price_code, price_tens, price_hundreds, price_thousands) VALUES (?,?,?,?)
      `,[p.price_code,p.price_tens,p.price_hundreds,p.price_thousands]).then(rows => {
        if (rows.affectedRows !== 1) {
          util.handle_sql_error('inserting price', e_msg, 500, "none", res, conn);
        } else {
          conn.end();
          res.send(p);
        }
      }).catch(err => {
        util.handle_sql_error('inserting price', e_msg, 500, err, res, conn);
      })
  }).catch(err => {
      util.handle_sql_error('getting connection from pool', e_msg, 500, err, res, conn);
  })
})

// PUT update price
router.put('/:old_price_code', function (req, res) {
  let db_pool = req.app.get('db_pool');
  let e_msg = `Err: PUT /api/price/${req.params.old_price_code} -`;
  let p = req.body;

  db_pool.getConnection().then(conn => {
    conn.query(`
      UPDATE Prices SET price_code=?, price_tens=?, price_hundreds=?, price_thousands=?
      WHERE price_code=?
      `,[p.price_code,p.price_tens,p.price_hundreds,p.price_thousands,req.params.old_price_code]).then(rows => {
        if (rows.affectedRows !== 1) {
          util.handle_sql_error(`updating price ${req.params.old_price_code}, doesn't exist`, e_msg, 404, "none", res, conn);
        } else {
          conn.end();
          res.send(p);
        }
      }).catch(err => {
        util.handle_sql_error('updating price', e_msg, 500, err, res, conn);
      })
  }).catch(err => {
      util.handle_sql_error('getting connection from pool', e_msg, 500, err, res, conn);
  })
})

// DELETE price
router.delete('/:price_code', function (req, res) {
  let db_pool = req.app.get('db_pool');
  let e_msg = `Err: DELETE /api/price/${req.params.price_code} -`;

  db_pool.getConnection().then(conn => {
    conn.query(`
      DELETE FROM Prices WHERE price_code=?
      `,[req.params.price_code]).then(rows => {
        if (rows.affectedRows !== 1) {
          util.handle_sql_error(`deleting price ${req.params.price_code}, doesn't exist`, e_msg, 404, "none", res, conn);
        } else {
          conn.end();
          res.send("");
        }
      }).catch(err => {
        util.handle_sql_error('deleting price', e_msg, 500, err, res, conn);
      })
  }).catch(err => {
      util.handle_sql_error('getting connection from pool', e_msg, 500, err, res, conn);
  })
})

module.exports = router

const express = require('express');
const router = express.Router();
const util = require('../utilities');

// Middleware if we had any.
router.use(function (req, res, next) {
  next()
})

// GET all quotes
router.get('/', function (req, res) {
  let db_pool = req.app.get('db_pool');
  let e_msg = "Err: GET /api/quote -";

  db_pool.getConnection().then(conn => {
    conn.query(`SELECT * FROM Quote`).then(rows => {
      conn.end();
      res.send(rows);
    }).catch(err => {
      util.handle_sql_error('getting all quotes', e_msg, 500, err, res, conn);
    })
  }).catch(err => {
      util.handle_sql_error('getting connection from pool', e_msg, 500, err, res, conn);
  })
})

// GET single quote by quote_ref
router.get('/:quote_ref', function (req, res) {
  let db_pool = req.app.get('db_pool');
  let e_msg = `Err: GET /api/quote/${req.params.quote_ref} -`;

  db_pool.getConnection().then(conn => {
    conn.query(`SELECT * FROM Quote WHERE quote_ref=?`,[req.params.quote_ref]).then(rows => {
      if (rows.length !== 1) {
        util.handle_sql_error(`getting quote ${req.params.quote_ref}, doesn't exist`, e_msg, 404, "none", res, conn);
      } else {
        conn.end();
        res.send(rows[0]);
      }
    }).catch(err => {
      util.handle_sql_error('getting quote', e_msg, 500, err, res, conn);
    })
  }).catch(err => {
      util.handle_sql_error('getting connection from pool', e_msg, 500, err, res, conn);
  })
})

// POST new quote
router.post('/', function (req, res) {
  let db_pool = req.app.get('db_pool');
  let e_msg = "Err: POST /api/quote -";
  let q = req.body;

  db_pool.getConnection().then(conn => {
    conn.query(`
      INSERT INTO Quote (quote_ref, quote_number) VALUES (?,?)
      `,[q.quote_ref,q.quote_number]).then(rows => {
        if (rows.affectedRows !== 1) {
          util.handle_sql_error('inserting quote', e_msg, 500, "none", res, conn);
        } else {
          conn.end();
          res.send(q);
        }
      }).catch(err => {
        util.handle_sql_error('inserting quote', e_msg, 500, err, res, conn);
      })
  }).catch(err => {
      util.handle_sql_error('getting connection from pool', e_msg, 500, err, res, conn);
  })
})

// PUT update quote
router.put('/:old_quote_ref', function (req, res) {
  let db_pool = req.app.get('db_pool');
  let e_msg = `Err: PUT /api/quote/${req.params.quote_ref} -`;
  let q = req.body;

  db_pool.getConnection().then(conn => {
    conn.query(`
      UPDATE Quote SET quote_ref=?, quote_number=? WHERE quote_ref=?
      `,[q.quote_ref,q.quote_number,req.params.old_quote_ref]).then(rows => {
        if (rows.affectedRows !== 1) {
          util.handle_sql_error(`updating quote ${req.params.old_quote_ref}, doesn't exist`, e_msg, 404, "none", res, conn);
        } else {
          conn.end();
          res.send(q);
        }
      }).catch(err => {
        util.handle_sql_error('updating quote', e_msg, 500, err, res, conn);
      })
  }).catch(err => {
      util.handle_sql_error('getting connection from pool', e_msg, 500, err, res, conn);
  })
})

// DELETE quote
router.delete('/:quote_ref', function (req, res) {
  let db_pool = req.app.get('db_pool');
  let e_msg = `Err: DELETE /api/quote/${req.params.quote_ref} -`;

  db_pool.getConnection().then(conn => {
    conn.query(`
      DELETE FROM Quote WHERE quote_ref=?
      `,[req.params.quote_ref]).then(rows => {
        if (rows.affectedRows !== 1) {
          util.handle_sql_error(`deleting quote ${req.params.quote_ref}, doesn't exist`, e_msg, 404, "none", res, conn);
        } else {
          conn.end();
          res.send("");
        }
      }).catch(err => {
        util.handle_sql_error('deleting quote', e_msg, 500, err, res, conn);
      })
  }).catch(err => {
      util.handle_sql_error('getting connection from pool', e_msg, 500, err, res, conn);
  })
})

module.exports = router

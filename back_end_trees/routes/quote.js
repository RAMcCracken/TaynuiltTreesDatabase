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

// GET a detailed quote by :quote_ref.
// Return all ass_quote_products
router.get('/:quote_ref/detailed', function (req, res) {
  let quote_ref = req.params.quote_ref;
  let db_pool = req.app.get('db_pool');
  let e_msg = `Err: GET /api/quote/${quote_ref}/detailed -`;
  db_pool.getConnection()
    .then(conn => {
      conn.query(`
        SELECT * FROM Quote WHERE quote_ref = ?
        `, [quote_ref])
        .then(rows => {
          if (rows.length !== 1) {
            throw "quote not found"
          } 
          quote = {quote: rows[0]}
        })
          .then(() => {
            // get ass quote prod
            conn.query(`
              SELECT * FROM Quote_Products WHERE quote_ref = ?
              `, [quote_ref])
              .then(rows => {
                quote.quote_ass_prod = rows;
                conn.end();
                res.send(quote);
              })
          })
        .catch(err => {
          util.handle_sql_error('getting quotes', e_msg, 500, err, res, conn);
        })
      })
      .catch(err => {
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
      INSERT INTO Quote (quote_number, order_date, credit_period, picked, location, stock_reserve, customer_po, customer_ref) VALUES (?,?,?,?,?,?,?,?)
      `,[q.quote_number,q.order_date,q.credit_period,q.picked,q.location,q.stock_reserve,q.customer_po,q.customer_ref]).then(rows => {
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
      UPDATE Quote SET quote_ref=?, quote_number=?, order_date=?, credit_period=?, picked=?, location=?, stock_reserve=?, customer_po=?, customer_ref=?
      WHERE quote_ref = ?
      `,[q.quote_ref,q.quote_number,q.order_date,q.credit_period,q.picked,q.location,q.stock_reserve,q.customer_po,q.customer_ref,req.params.old_quote_ref]).then(rows => {
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

// POST an quote product
router.post(`/:quote_no/product`, function (req, res) {
  let db_pool = req.app.get('db_pool');
  let e_msg = `Err: POST /api/quote/${req.params.quote_no}/product -`;
  let q = req.body;

  db_pool.getConnection().then(conn => {
    conn.query(`
      INSERT INTO Quote_Products (quote_no, product_code, bags, quantity)
      VALUES (?,?,?,?)
      `, [q.quote_ref,q.product_code,q.bags,q.quantity,]).then(() => {
        conn.end();
        res.send(i);
      }).catch(err => {
          util.handle_sql_error(`adding quote product`, e_msg, 500, err, res, conn);
      })
  }).catch(err => {
      util.handle_sql_error(`getting connection from pool`, e_msg, 500, err, res, conn);
  })
})

// PUT update an quote product
router.put('/:old_quote_no/product/:old_product_code', function (req, res) {
  let db_pool = req.app.get('db_pool');
  let e_msg = `Err: PUT /api/quote/${req.params.old_quote_no}/product/${req.params.old_product_code} -`;
  let i = req.body;

  db_pool.getConnection().then(conn => {
    conn.query(`
      UPDATE Quote_Products SET quote_no=?,product_code=?,bags=?,quantity=?
      WHERE quote_no=? AND product_code=?
      `,[i.quote_no,i.product_code,i.bags,i.quantity,req.params.old_quote_no,req.params.old_product_code])
      .then(rows => {
        if (rows.affectedRows !== 1) {
          util.handle_sql_error(`updating quote product ${req.params.old_quote_no}/${req.params.old_product_code}, doesn't exist`, e_msg, 404, "none", res, conn);
        } else {
          conn.end();
          res.send(i);
        }
      })
      .catch(err => {
        util.handle_sql_error(`updating quote product`, e_msg, 500, err, res, conn);
      })
  }).catch(err => {
      util.handle_sql_error(`getting connection from pool`, e_msg, 500, err, res, conn);
  })
})

// DELETE quote product
router.delete('/:quote_no/product/:product_code', function (req, res) {
  let db_pool = req.app.get('db_pool');
  let e_msg = `Err: DELETE /api/quote/${req.params.quote_no}/product/${req.params.product_code} -`;

  db_pool.getConnection().then(conn => {
    conn.query(`
      DELETE FROM Quote_Products WHERE quote_no=? AND product_code=?
      `,[req.params.quote_no,req.params.product_code]).then(rows => {
        if (rows.affectedRows !== 1) {
          util.handle_sql_error(`deleting quote product ${req.params.quote_no}/${req.params.product_code}, doesn't exist`, e_msg, 404, "none", res, conn);
        } else {
          conn.end();
          res.send("");
        }
      }).catch(err => {
        util.handle_sql_error('deleting quote product', e_msg, 500, err, res, conn);
      })
  }).catch(err => {
      util.handle_sql_error('getting connection from pool', e_msg, 500, err, res, conn);
  })
})

// POST to turn a quote into an order
router.post('/:quote_ref/confirm', function (req, res) {
  let db_pool = req.app.get('db_pool');
  let e_msg = `Err: POST /api/quote/${req.params.quote_ref}/confirm -`;
  let b = req.body;
  let order_no = `o${req.params.quote_ref}`;

  // INSERT ORDER
  // INSERT Order products from quote products
  // UPDATE quote conf
  // COMMIT
  db_pool.getConnection().then(conn => {
    conn.beginTransaction().then(() => {
      conn.query(`INSERT INTO Orders VALUES(?,?,?,?,?,?,?,?,?)`,
        [order_no,b.order_date,b.credit_period,b.picked,b.location,b.stock_reserve,b.customer_po,req.params.quote_ref,b.customer_ref]).then(() => {
          conn.query(`
            INSERT INTO Order_Products (order_no, product_code, bags, quantity)
            SELECT ?, product_code, bags, quantity
            FROM Quote_Products WHERE quote_ref = ?
            `,[order_no,req.params.quote_ref]).then(() => {
              conn.query(`
                UPDATE Quote SET quote_confirmed=1 WHERE quote_ref = ?
                `,[req.params.quote_ref]).then(() => {
                  conn.commit();
                  res.send("");
                }).catch(err => {
                  util.handle_sql_error('updating quote confirmation', e_msg, 500, err, res, conn);
                })
            }).catch(err => {
              util.handle_sql_error('inserting order products', e_msg, 500, err, res, conn);
            })
        }).catch(err => {
          util.handle_sql_error('inserting order', e_msg, 500, err, res, conn);
        })
    }).catch(err => {
      util.handle_sql_error('starting transaction', e_msg, 500, err, res, conn);
    })
  }).catch(err => {
      util.handle_sql_error('getting connection from pool', e_msg, 500, err, res, conn);
  })
})


module.exports = router

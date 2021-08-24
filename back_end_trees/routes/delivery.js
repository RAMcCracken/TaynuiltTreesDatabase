const express = require('express');
const router = express.Router();
const util = require('../utilities');

// Middleware if we had any.
router.use(function (req, res, next) {
  next()
})

// GET all deliveries
router.get('/', function (req, res) {
  let db_pool = req.app.get('db_pool');
  let e_msg = "Err: GET /api/delivery -";

  db_pool.getConnection().then(conn => {
    conn.query(`SELECT * FROM Delivery`).then(rows => {
      conn.end();
      res.send(rows);
    }).catch(err => {
      util.handle_sql_error('getting all deliveries', e_msg, 500, err, res, conn);
    })
  }).catch(err => {
      util.handle_sql_error('getting connection from pool', e_msg, 500, err, res, conn);
  })
})

// GET single delivery by delivery ref
router.get('/:delivery_ref', function (req, res) {
  let db_pool = req.app.get('db_pool');
  let e_msg = `Err: GET /api/delivery/${req.params.delivery_ref} -`;

  db_pool.getConnection().then(conn => {
    conn.query(`SELECT * FROM Delivery WHERE delivery_ref=?`,[req.params.delivery_ref]).then(rows => {
      if (rows.length !== 1) {
        util.handle_sql_error(`getting delivery ${req.params.delivery_ref}, doesn't exist`, e_msg, 404, "none", res, conn);
      } else {
        conn.end();
        res.send(rows[0]);
      }
    }).catch(err => {
      util.handle_sql_error('getting delivery', e_msg, 500, err, res, conn);
    })
  }).catch(err => {
      util.handle_sql_error('getting connection from pool', e_msg, 500, err, res, conn);
  })
})

// POST new delivery
router.post('/', function (req, res) {
  let db_pool = req.app.get('db_pool');
  let e_msg = "Err: POST /api/delivery -";
  let d = req.body;

  db_pool.getConnection().then(conn => {
    conn.query(`
      INSERT INTO Delivery (delivery_ref, address_number, address_street, address_town, address_postcode, dispatch_date, site_ref, delivery_charge, box_bag_total, notes) VALUES (?,?,?,?,?,?,?,?,?,?)
      `,[d.delivery_ref, d.address_number, d.address_street, d.address_town, d.address_postcode, d.dispatch_date, d.site_ref, d.delivery_charge, d.box_bag_total, d.notes]).then(rows => {
        if (rows.affectedRows !== 1) {
          util.handle_sql_error('inserting delivery', e_msg, 500, "none", res, conn);
        } else {
          conn.end();
          res.send(d);
        }
      }).catch(err => {
        util.handle_sql_error('inserting delivery', e_msg, 500, err, res, conn);
      })
  }).catch(err => {
      util.handle_sql_error('getting connection from pool', e_msg, 500, err, res, conn);
  })
})

// PUT update quote
router.put('/:old_delivery_ref', function (req, res) {
  let db_pool = req.app.get('db_pool');
  let e_msg = `Err: PUT /api/delivery/${req.params.delivery_ref} -`;
  let d = req.body;

  db_pool.getConnection().then(conn => {
    conn.query(`
      UPDATE Delivery SET delivery_ref=?, address_number=?, address_street=?, address_town=?, address_postcode=?, dispatch_date=?, site_ref=?, delivery_charge=?, box_bag_total=?, notes=? WHERE delivery_ref=?
      `,[d.delivery_ref, d.address_number, d.address_street, d.address_town, d.address_postcode, d.dispatch_date, d.site_ref, d.delivery_charge, d.box_bag_total, d.notes, req.params.old_delivery_ref]).then(rows => {
        if (rows.affectedRows !== 1) {
          util.handle_sql_error(`updating delivery ${req.params.old_delivery_ref}, doesn't exist`, e_msg, 404, "none", res, conn);
        } else {
          conn.end();
          res.send(d);
        }
      }).catch(err => {
        util.handle_sql_error('updating delivery', e_msg, 500, err, res, conn);
      })
  }).catch(err => {
      util.handle_sql_error('getting connection from pool', e_msg, 500, err, res, conn);
  })
})

// DELETE delivery
router.delete('/:delivery_ref', function (req, res) {
  let db_pool = req.app.get('db_pool');
  let e_msg = `Err: DELETE /api/delivery/${req.params.delivery_ref} -`;

  db_pool.getConnection().then(conn => {
    conn.query(`
      DELETE FROM Delivery WHERE delivery_ref=?
      `,[req.params.delivery_ref]).then(rows => {
        if (rows.affectedRows !== 1) {
          util.handle_sql_error(`deleting delivery ${req.params.delivery_ref}, doesn't exist`, e_msg, 404, "none", res, conn);
        } else {
          conn.end();
          res.send("");
        }
      }).catch(err => {
        util.handle_sql_error('deleting delivery', e_msg, 500, err, res, conn);
      })
  }).catch(err => {
      util.handle_sql_error('getting connection from pool', e_msg, 500, err, res, conn);
  })
})

module.exports = router

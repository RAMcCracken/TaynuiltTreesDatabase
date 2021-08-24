const express = require('express');
const router = express.Router();
const util = require('../utilities');

// Middleware if we had any.
router.use(function (req, res, next) {
  next()
})

// GET all species'
router.get('/', function (req, res) {
  let db_pool = req.app.get('db_pool');
  let e_msg = "Err: GET /api/species -";

  db_pool.getConnection().then(conn => {
    conn.query(`SELECT * FROM Species`).then(rows => {
      conn.end();
      res.send(rows);
    }).catch(err => {
      util.handle_sql_error('getting all species', e_msg, 500, err, res, conn);
    })
  }).catch(err => {
      util.handle_sql_error('getting connection from pool', e_msg, 500, err, res, conn);
  })
})

// GET single species by species_code
router.get('/:species_code', function (req, res) {
  let db_pool = req.app.get('db_pool');
  let e_msg = `Err: GET /api/species/${req.params.species_code} -`;

  db_pool.getConnection().then(conn => {
    conn.query(`SELECT * FROM Species WHERE species_code=?`,[req.params.species_code]).then(rows => {
      if (rows.length !== 1) {
        util.handle_sql_error(`getting species ${req.params.species_code}, doesn't exist`, e_msg, 404, err, res, conn);
      } else {
        conn.end();
        res.send(rows);
      }
    }).catch(err => {
      util.handle_sql_error('single species', e_msg, 500, err, res, conn);
    })
  }).catch(err => {
      util.handle_sql_error('getting connection from pool', e_msg, 500, err, res, conn);
  })
})

// POST new species
router.post('/', function (req, res) {
  let db_pool = req.app.get('db_pool');
  let e_msg = "Err: GET /api/species -";
  let s = req.body;

  db_pool.getConnection().then(conn => {
    conn.query(`
      INSERT INTO Species (species_code, common_name, latin_name) VALUES (?,?,?)
      `,[s.species_code,s.common_name,s.latin_name]).then(rows => {
        if (rows.affectedRows !== 1) {
          util.handle_sql_error('inserting species', e_msg, 500, "none", res, conn);
        } else {
          conn.end();
          res.send(s);
        }
      }).catch(err => {
        util.handle_sql_error('inserting species', e_msg, 500, err, res, conn);
      })
  }).catch(err => {
      util.handle_sql_error('getting connection from pool', e_msg, 500, err, res, conn);
  })
})

// PUT update species
router.put('/:old_species_code', function (req, res) {
  let db_pool = req.app.get('db_pool');
  let e_msg = `Err: PUT /api/species/${req.params.old_species_code} -`;
  let s = req.body;

  db_pool.getConnection().then(conn => {
    conn.query(`
      UPDATE Species SET species_code=?, common_name=?, latin_name=?
      WHERE species_code=?
      `,[s.species_code,s.common_name,s.latin_name,req.params.old_species_code]).then(rows => {
        if (rows.affectedRows !== 1) {
          util.handle_sql_error(`updating species ${req.params.old_species_code}, doesn't exist`, e_msg, 404, "none", res, conn);
        } else {
          conn.end();
          res.send(s);
        }
      }).catch(err => {
        util.handle_sql_error('updating species', e_msg, 500, err, res, conn);
      })
  }).catch(err => {
      util.handle_sql_error('getting connection from pool', e_msg, 500, err, res, conn);
  })
})

// DELETE species
router.delete('/:species_code', function (req, res) {
  let db_pool = req.app.get('db_pool');
  let e_msg = `Err: DELETE /api/species/${req.params.species_code} -`;

  db_pool.getConnection().then(conn => {
    conn.query(`
      DELETE FROM Species WHERE species_code=?
      `,[req.params.species_code]).then(rows => {
        if (rows.affectedRows !== 1) {
          util.handle_sql_error(`deleting species ${req.params.species_code}, doesn't exist`, e_msg, 404, "none", res, conn);
        } else {
          conn.end();
          res.send("");
        }
      }).catch(err => {
        util.handle_sql_error('deleting species', e_msg, 500, err, res, conn);
      })
  }).catch(err => {
      util.handle_sql_error('getting connection from pool', e_msg, 500, err, res, conn);
  })
})

module.exports = router

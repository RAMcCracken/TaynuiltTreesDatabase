function handle_sql_error(info, e_msg, status_code, sql_err, res,conn) {
  if (conn) {
    conn.rollback();
    conn.end();
  }
  console.log(`${e_msg} ${info}\n${sql_err}`);
  //res.status(status_code).send(`${e_msg} ${info}\n${sql_err}`);
  res.status(status_code).json({context:`${e_msg}`, info:`${info}`,sql_err:`${sql_err}`})
}

module.exports = {
  handle_sql_error: handle_sql_error
};

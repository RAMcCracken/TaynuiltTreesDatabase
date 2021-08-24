const express = require('express')
const app = express()
const port = 21451

const mariadb = require('mariadb')
const db_pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  connectionLimit: 5
})

// puts the pool into app, so that other routes can use it. ie customer.js
app.set('db_pool', db_pool)

app.use(express.json())

// with this, all queries that begin with /api/customer/foo
// to go the customer.js file, where it will see the query as /foo
const customer_routes = require('./routes/customer')
app.use('/api/customer', customer_routes)

const orders_routes = require('./routes/orders')
app.use('/api/order', orders_routes)

const quote_routes = require('./routes/quote')
app.use('/api/quote', quote_routes)

const invoice_routes = require('./routes/invoice')
app.use('/api/invoice', invoice_routes)

app.get('/', (_, res) => {
  res.send("ping")
})

app.listen(port, () => {
  console.log(`Super Taynuilt Tree's db listening on ${port}`)
})

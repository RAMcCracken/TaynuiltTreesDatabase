const express = require('express')
const app = express()
const port = 21451

app.get('/api', (req, res) => {
  res.send('Hello API!')
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

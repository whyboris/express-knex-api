require('dotenv').config()

const express = require('express')
const app = express()
const port = 3000

var knex = require('knex')({
  client: 'mysql',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: "homework"
  }
});

/**
 * Route to search for businesses
 * @route {GET} /businesses
 * @param {string} [name]    - name of business,    substring search
 * @param {string} [address] - address of business, substring search
 * @param {string} [city]    - city of business,    exact match
 * @param {string} [state]   - city of business,    exact match
 */
app.get('/businesses', function (req, res) {
  console.log(req.query);

  const query = knex.select().from('businesses');

  if (req.query.name) {
    query.where('name','like','%' + req.query.name + '%');
  }

  if (req.query.address) {
    query.where('address','like','%' + req.query.address + '%');
  }

  if (req.query.city) {
    query.where('city', req.query.address);
  }

  if (req.query.state) {
    query.where('state', req.query.state);
  }

  query.then((result) => {
    res.send(result)
  });

})

app.put('/businesses', function (req, res) {
  console.log(req);
  res.send('put stuff');
})

app.listen(port, () => console.log(`Businesses API listening on port ${port}!`))

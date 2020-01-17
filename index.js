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

/**
 * Update or create a new resource
 * @route {PUT} /businesses
 * @parm {string} [uuid] - if present, will update resource with the particular uuid
 */
app.put('/businesses', express.json({type: '*/*'}), function (req, res) {
  const query = knex.select().from('businesses');

  if (req.body.uuid) {
    query.where({ uuid: req.body.uuid })

    const newEntry = {
      uuid: req.body.uuid
    }

    if (req.body.name) {
      newEntry.name = req.body.name
    }
    if (req.body.address) {
      newEntry.address = req.body.address
    }
    if (req.body.address2) {
      newEntry.address2 = req.body.address2
    }
    if (req.body.city) {
      newEntry.city = req.body.city
    }
    if (req.body.zip) {
      newEntry.zip = req.body.zip
    }
    if (req.body.country) {
      newEntry.country = req.body.country
    }
    if (req.body.phone) {
      newEntry.phone = req.body.phone
    }
    if (req.body.website) {
      newEntry.website = req.body.website
    }

    query.update(newEntry).then((result) => {
      if (result === 1) {
        res.send({ status: 'success', message: 'Business successfully updated' });
      } else if (result === 0) {
        res.send({ status: 'error', message: 'No business with such uuid found' });
      } else {
        res.send({ status: 'error', message: 'An unknown error occurred' });
      }
    });
  }
})

app.listen(port, () => console.log(`Businesses API listening on port ${port}!`))

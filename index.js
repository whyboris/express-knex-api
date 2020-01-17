require('dotenv').config()

const express = require('express')
const app = express()
const port = 3000

const hash = require('object-hash');

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
 * @param {string} [uuid] - if present, will update resource with the particular uuid
 */
app.put('/businesses', express.json({type: '*/*'}), function (req, res) {
  const query = knex.select().from('businesses');

  if (req.body.uuid) {
    query.where({ uuid: req.body.uuid })

    const newData = getCleanObjectForDB(req.body);

    query.update(newData).then((result) => {
      if (result === 1) {
        res.send({ status: 'success', message: 'Business successfully updated' });
      } else if (result === 0) {
        res.status(404);
        res.send({ status: 'error', message: 'No business with such uuid found' });
      } else {
        res.status(400);
        res.send({ status: 'error', message: 'An unknown error occurred' });
      }
    });
  } else {
    const newEntry = getCleanObjectForDB(req.body);
    const uuid = hash(req.body);
    newEntry.uuid = uuid;

    query.insert(newEntry).then((result) => {
      res.send({ status: 'success', message: 'New entry created', uuid: uuid });
    }).catch((err) => {
      if (err.code === 'ER_DUP_ENTRY') {
        res.status(409)
        res.send({ status: 'error', message: 'This entry is a duplicate' });
      } else {
        res.status(400);
        res.send({ status: 'error', message: 'An unknown error occurred' });
      }
    })
  }
})

/**
 * Return clean object for inserting into database
 * @param {object} query - any object
 * @returns {object} containyng at most these properties: name, address, address2, city, zip, coutry, phone, website
 */
function getCleanObjectForDB(query) {
  const newEntry = {};

  if (query.name) {
    newEntry.name = query.name
  }
  if (query.address) {
    newEntry.address = query.address
  }
  if (query.address2) {
    newEntry.address2 = query.address2
  }
  if (query.city) {
    newEntry.city = query.city
  }
  if (query.zip) {
    newEntry.zip = query.zip
  }
  if (query.country) {
    newEntry.country = query.country
  }
  if (query.phone) {
    newEntry.phone = query.phone
  }
  if (query.website) {
    newEntry.website = query.website
  }

  return (query);
}


app.listen(port, () => console.log(`Businesses API listening on port ${port}!`))

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
    database: process.env.DB_DATABASE,
  }
});

/**
 * Route to search for businesses
 * @route {GET} /businesses
 * @param {string} [uuid]    - uuid,                exact match
 * @param {string} [name]    - name of business,    substring search
 * @param {string} [address] - address of business, substring search
 * @param {string} [city]    - city of business,    exact match
 * @param {string} [state]   - city of business,    exact match
 */
app.get('/businesses', function(req, res) {

  const user = req.get('user');
  const pass = req.get('pass');

  if (!user || !pass) {
    res.status(401);
    res.json({ status: 'error', message: 'headers missing' });
  } else {
    validate(user, pass).then((result) => {
      if (result) { // user type or `null`
        searchForBusiness(req, res);
      } else {
        res.status(401);
        res.json({ status: 'error', message: 'not authorized' });
      }
    });
  }
})

/**
 * Perform the search against business database
 * @param {*} req
 * @param {*} res
 */
function searchForBusiness(req, res) {

  const query = knex.select().from(process.env.DB_TABLE);

  if (req.query.uuid) {
    query.where('uuid', req.query.uuid);
  } else {
    if (req.query.name) {
      query.where('name', 'like', '%' + req.query.name + '%');
    }
    if (req.query.address) {
      query.where('address', 'like', '%' + req.query.address + '%');
    }
    if (req.query.city) {
      query.where('city', req.query.address);
    }
    if (req.query.state) {
      query.where('state', req.query.state);
    }
  }

  query.then((result) => {
    res.send(result)
  });
}

/**
 * Get user type from database; return `null` if not found
 * @param {string} name
 * @param {string} pass
 */
function validate(name, pass) {
  return new Promise((resolve, reject) => {
    const query = knex.select().from('users');

    query.where('user', name);
    query.where('pass', pass);

    query.then((result) => {
      if (result.length) {
        resolve(result[0].type); // admin or user
      } else {
        resolve(null);
      }
    });
  });
}

/**
 * Update or create a new resource
 *
 * (1) if uuid present:
 *       - if uuid matches an existing resource: updates that resource
 *       - if uuid NOT found, returns 'not found' error
 * (2) if uuid NOT present:
 *       - Creates a resource and returns its newly-generated uuid.
 *       - Subsequent identical calls will return a 'duplicate' error
 *
 * @route {PUT} /businesses
 * @param {string} [uuid] - if present, will update resource with the particular uuid
 */
app.put('/businesses', express.json({ type: 'application/json' }), function (req, res) {

  const user = req.get('user');
  const pass = req.get('pass');

  if (!user || !pass) {
    res.status(401);
    res.json({ status: 'error', message: 'headers missing' });
  } else {
    validate(user, pass).then((result) => {
      if (result === 'admin') {
        insertOrUpdateBusiness(res, req);
      } else {
        res.status(401);
        res.json({ status: 'error', message: 'not authorized' });
      }
    });
  }
})

/**
 * Insert new business or update existing one
 * @param {*} res
 * @param {*} req
 */
function insertOrUpdateBusiness(res, req) {

  if (req.body.uuid) {

    const query = knex.select().from('businesses');

    query.where({ uuid: req.body.uuid })

    const newData = getCleanObjectForDB(req.body);

    query.update(newData).then((result) => {
      if (result === 1) {
        res.json({ status: 'success', message: 'Business successfully updated' });
      } else if (result === 0) {
        res.status(404);
        res.json({ status: 'error', message: 'No business with such uuid found' });
      } else {
        res.status(400);
        res.json({ status: 'error', message: 'An unknown error occurred' });
      }
    });
  } else {
    const newEntry = getCleanObjectForDB(req.body);
    const uuid = hash(req.body);
    newEntry.uuid = uuid;
    // TODO - include created_at date and format correctly
    // newEntry.created_at = (new Date()).toString();

    query.insert(newEntry).then((result) => {
      res.json({ status: 'success', message: 'New entry created', uuid: uuid });
    }).catch((err) => {
      if (err.code === 'ER_DUP_ENTRY') {
        res.status(409)
        res.json({ status: 'error', message: 'This entry is a duplicate' });
      } else {
        res.status(400);
        res.json({ status: 'error', message: 'An unknown error occurred' });
      }
    })
  }
}

app.use(function(error, req, res, next) {
  // Handle JSON parse errors
  res.status(400);
  res.json({ status: 'error', message: error.message });
});

/**
 * Return clean object for inserting into database
 * @param {object} query - any object
 * @returns {object} containyng at most these properties: name, address, address2, city, state, zip, coutry, phone, website
 */
function getCleanObjectForDB(query) {
  const newEntry = {};

  const validProperty = [
    'name',
    'address',
    'address2',
    'city',
    'state',
    'zip',
    'country',
    'phone',
    'website',
  ];

  validProperty.forEach((property) => {
    if (query[property]) {
      newEntry[property] = query[property];
    }
  });

  return (newEntry);
}


app.listen(port, () => console.log(`Businesses API listening on port ${port}!`))

require('dotenv').config()

const express = require('express')
const app = express()
const port = 3000

const { find } = require('./users');
const { search, insert } = require('./businesses');

const isAdmin = async (req, res, next) => {

  const user = await find(req.query.email, req.query.password);

  if (!user || user.role !== 'admin'){
    var err = new Error('Not authorized! Go back!');
    err.status = 400;
    return next(err);
  }

  return next();

}

/**
 * Route to search for businesses
 * @route {GET} /businesses
 * @param {string} [uuid]    - uuid,                exact match
 * @param {string} [name]    - name of business,    substring search
 * @param {string} [address] - address of business, substring search
 * @param {string} [city]    - city of business,    exact match
 * @param {string} [state]   - city of business,    exact match
 */
app.get('/businesses', isAdmin, function(req, res) {
  const businesses = search(req.params);
  res.status(200);
  res.json(businesses)
})

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
app.put('/businesses', isAdmin, express.json({ type: 'application/json' }), async function (req, res) {

  const result = await insert(req.body);

  if (result === 1) {
    res.json({ status: 'success', message: 'Business successfully updated' });
  } else if (result === 0) {
    res.status(404);
    res.json({ status: 'error', message: 'No business with such uuid found' });
  } else {
    res.status(400);
    res.json({ status: 'error', message: 'An unknown error occurred' });
  }

})


app.use(function(error, req, res, next) {
  // Handle JSON parse errors
  res.status(400);
  res.json({ status: 'error', message: error.message });
});

app.listen(port, () => console.log(`Businesses API listening on port ${port}!`))

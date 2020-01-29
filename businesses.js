var db = require('./db')


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

module.exports = {

 async search(params) {

    const query = db.select().from('businesses');

    if (params.uuid) {
      query.where('uuid', params.uuid);
    } else {
      if (params.name) {
        query.where('name', 'like', '%' + params.name + '%');
      }
      if (params.address) {
        query.where('address', 'like', '%' + params.address + '%');
      }
      if (params.city) {
        query.where('city', params.address);
      }
      if (params.state) {
        query.where('state', params.state);
      }
    }

    return await query;

  },

  async insert (params) {

    if (params.uuid) {

      const query = db.select().from('businesses');

      query.where({ uuid: params.uuid })

      const newData = getCleanObjectForDB(params);

      return await query.update(newData);

    } else {

      const newEntry = getCleanObjectForDB(params);

      const uuid = hash(params);

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
}
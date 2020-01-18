# BUSINESSES API

A _RESTful API_ that interacts with busisenss data. Allows to *GET* search and *PUT* create/update of businesses.

### GET

`/business` allows any combination of these parameters:

| param   | search type |
| ------- | ----------- |
| uuid    | exact match |
| name    | substring search |
| address | substring search |
| city    | exact match |
| state   | exact match |

All searches and matches are case insensitive (e.g. "NJ" is the same as "nj").

### PUT

`/business` requires a `JSON` body. It will:

- update a business if `uuid` is provided and matches an existing business, or
- create a business if `uuid` is not provided
    - duplicate requests will result in 'duplicate' error returned to user

### Development

- update `.env` file with your _MySQL_ credentials, database, and table name
- `npm run dev` will start [nodemon](https://github.com/remy/nodemon) which will reload the server when `index.js` is updated

### Notes

- `.evn` file should not be committed to a repository, it is included here for demonstration only
- We are using [knex](https://github.com/knex/knex) query builder to avoid SQL injections
- The `uuid` column (_varchar(40)_) in the table is _primary_ so it will not allow duplicate entries
- We are using [object-hash](https://github.com/puleos/object-hash) to generate a unique hash for `/PUT` requests that do not have a `uuid` value.
   - This will make sure that subsequent calls with the exact same values will generate the same hash and prevent duplicate entries
   - Unfortunately, even though the column is named "uuid" it will contain hashes that do not match the [uuid format](https://en.wikipedia.org/wiki/Universally_unique_identifier#Format).
- We are using [pm2](https://github.com/Unitech/pm2) to run the server (`npm start`) and to automatically restart it if it ever fails

### Todo

- Insert `created_at` formatted appropriately when creating a resource
- Paginate results (currently searching with no arguments will respond with all businesses in the database)
- Add logging of errors on the server so as to fix problems when they come up
- Create a schema for the MySQL table and include in repository
- Migrate code to _TypeScript_ to catch more errors and have a better coding experience
- Rename `.env` file to `.env-example` with dummy values and add ".env" to `.gitignore`
- Add any appropriate tests (e.g. unit, integration, e2e, load)
- Move the `getCleanObjectForDB` method to another file for a cleaner `index.js` file
- `getCleanObjectForDB` can be refactored (loop through an array rather than go through a chain of `if` statements)

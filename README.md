# BUSINESSES API

A _RESTful API_ that interacts with busisenss data. Allows to *GET* search and *PUT* create/update of businesses.

GET `/business` allows any combination of these parameters:

| param   | search type |
| ------- | ----------- |
| uuid    | exact match |
| name    | substring search |
| address | substring search |
| city    | exact match |
| state   | exact match |

PUT `/business` will:
- update a business if `uuid` is provided and matches an existing business, or
- create a business if `uuid` is not provided
    - duplicate requests will result in 'duplicate' error returned to user

### Development

- update `.env` file with your _MySQL_ credentials
- `npm run dev`

### Notes

- `.evn` file should not be committed to a repository, it is included here for demonstration only


### Todo

-
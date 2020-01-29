
var db = require('./db')


module.exports = {
  async find(email, password) {

    if(!email || !password){
      return null;
    }

    let query = db.select().from('users');

    query.where("email", email)
    query.where("password", password)

    const users = await query;

    return users[0];

  }
}
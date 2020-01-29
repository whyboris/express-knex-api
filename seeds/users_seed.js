
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {id: 1, email: 'rowValue1@email.com', password: '123123', role: 'user'},
        {id: 2, email: 'rowValue2@email.com', password: '223123', role: 'user'},
        {id: 3, email: 'rowValue3@email.com', password: '323123', role: 'admin'},
        {id: 4, email: 'rowValue4@email.com', password: '423123', role: 'user'},
      ]);
    });
};

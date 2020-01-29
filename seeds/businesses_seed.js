
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('businesses').del()
    .then(function () {
      // Inserts seed entries
      return knex('businesses').insert([
        {id: 1, name: '123'},
        {id: 2, name: '123'},
        {id: 3, name: '123'},
        {id: 4, name: '123'},
        {id: 5, name: '123'},
        {id: 6, name: '123'}
      ]);
    });
};

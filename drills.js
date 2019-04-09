require('dotenv').config()
const knex = require('knex')

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
})

console.log('connection successful');

/*
function searchByText(searchTerm){
    console.log("HELLO");
    knexInstance
        .select('*')
        .from('shopping_list')
        .where('name','ILIKE',`%${searchTerm}%`)
        .then(result => console.log(result))
}*/

//searchByText('con');
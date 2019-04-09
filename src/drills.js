require('dotenv').config()
const knex = require('knex')

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
})

//console.log(process.env.DB_URL);


function searchByText(searchTerm){
    knexInstance
        .select('*')
        .from('shopping_list')
        .where('name','ILIKE',`%${searchTerm}%`)
        .then(result => console.log(result))
}
console.log("Search by Text: con");
searchByText('con');

function itemsPaginated(pageNumber){
  knexInstance
    .select('*')
    .from('shopping_list')
    .limit(6)
    .offset(6*(pageNumber-1))
    .then(result =>console.log(result))
}
console.log("6 items from page number:2")
itemsPaginated(2);

function itemsAfterDate(daysAgo){
  knexInstance
    .select('*')
    .from('shopping_list')
    .where('date_added','>',knexInstance.raw(`now()-'?? days'::INTERVAL`,daysAgo))
    .then(result=>console.log(result))
}
console.log("items that were added after: 2 days ago")
itemsAfterDate(2);

function totalCost(){
  knexInstance
    .select('category')
    .sum('price')
    .from('shopping_list')
    .groupBy('category')
    .then(result=>console.log(result))
}

console.log("total cost of items");
totalCost();
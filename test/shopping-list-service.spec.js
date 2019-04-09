const ShoppingListService = require('../src/shopping-list-service')
const knex = require('knex')

describe(`Shopping list service object`, function() {
    let db
    let testItems = [
        {
           id: 1,
           name: "something",
           date_added: new Date('2029-01-22T16:28:32.615Z'),
           price: '1.00',
           category: 'Breakfast'
        },
        {
           id: 2,
           name:"the second thing",
           date_added: new Date('2100-05-22T16:28:32.615Z'),            
           price: '2.00',
           category: 'Lunch'
        },
        {
           id: 3,
           name:"the third thing",
           date_published: new Date('1919-12-22T16:28:32.615Z'),
           price: '3.00',
           category: 'Main'
        },
        {
            id: 4,
            name:"the fourth thing",
            date_published: new Date('1919-12-22T16:28:32.615Z'),
            price: '4.00',
            category: 'Snack'
         },
    ]

    before(() => {
        db = knex({
        client: 'pg',
        connection: process.env.TEST_DB_URL,
        })
    })
   

    before(() => db('shopping_list').truncate())

    afterEach(() => db('shopping_list').truncate())

    after(() => db.destroy())

        context(`Given 'shopping list' has data`, () => {
            beforeEach(() => {
            return db
                .into('shopping_list')
                .insert(testItems)
              })
            it(`getAllItems() resolves all items from 'shopping_list' table`, () => {
            // test that ArticlesService.getAllArticles gets data from table
                return ShoppingListService.getAllItems(db)
              .then(actual => {
                expect(actual).to.eql(testItems)
                })
            })
            it(`getById() resolves an item by id from 'shopping_list' table`, () => {
                const thirdId = 3
                const thirdItem = testItems[thirdId - 1]
                return ShoppingListService.getById(db, thirdId)
                       .then(actual => {
                         expect(actual).to.eql({
                           id: thirdId,
                           name:thirdItem.name,
                           date_added:thirdItem.date_added,
                           price:thirdItem.price,
                           category:thirdItem.category,
                           checked:false,
                         })
                       })
            })

            it(`deleteItem() removes an article by id from 'shopping_list' table`, () => {
                     const ItemId = 3
                     return ShoppingListService.deleteArticle(db, ItemId)
                       .then(() => ShoppingListService.getAllArticles(db))
                       .then(allItems => {
                         // copy the test articles array without the "deleted" article
                         const expected = testItems.filter(item => item.id !== ItemId)
                         expect(allItems).to.eql(expected)
                       })
            })

            it(`updateItem() updates an item from the 'shopping_list' table`, () => {
                     const idOfItemToUpdate = 3
                     const newItemData = {
                       name: 'updated name',
                       price: 'updated price',
                       date_added: new Date(),
                       checked:true,
                     }
                     return ShoppingListService.updateItem(db, idOfItemToUpdate, newItemData)
                       .then(() => ShoppingListService.getById(db, idOfItemToUpdate))
                       .then(item => {
                         expect(item).to.eql({
                           id: idOfItemToUpdate,
                           ...newItemData,
                         })
                       })
            })


        })
        context(`Given 'shopping_list' has no data`, () => {
               it(`getAllItems() resolves an empty array`, () => {
                 return ShoppingListService.getAllItems(db)
                   .then(actual => {
                     expect(actual).to.eql([])
                   })
                })

                it(`insertItem() inserts an item and resolves the item with an 'id'`, () => {
                    const newItem = {
                      name: 'Test new name',
                      price: 'Test new price',
                      date_added: new Date('2020-01-01T00:00:00.000Z'),
                      category:'Lunch',
                      checked:true,
                    }
                  return ShoppingListService.insertArticle(db, newItem)
                  .then(actual => {
                         expect(actual).to.eql({
                            id: 1,
                            name: newItem.name,
                            price: newItem.price,
                            date_added: newItem.date_added,
                            checked:newItem.checked,
                            category:newItem.category
                          })
                        })
                })
                 
        })
})

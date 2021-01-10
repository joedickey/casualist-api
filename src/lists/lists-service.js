const ListsService = {
    createList(db, data) {
        return db('lists')
            .insert(data)
            .returning('*')
            .then(rows => rows[0])
    },
    getList(db, urlId) {
        return db('lists')
            .select('*')
            .where({url_path: urlId})
            .then(rows => rows[0])
    },
    getListItems(db, listId) {
        return db('items')
            .select('*')
            .where({list_id: listId})
    },
    deleteList(db, urlId) {
        return db('lists')
            .where({url_path: urlId})
            .delete()
    }
}

module.exports = ListsService;

const ItemsService = {
    createItem(db, data) {
        return db('items')
            .insert(data)
            .returning('*')
            .then(rows => rows[0])
    },
    getItem(db, id) {
        return db('items')
            .select('*')
            .where({id: id})
    },
    deleteItem(db, id) {
        return db('items')
            .where({id: id})
            .delete()
    }
}

module.exports = ItemsService;

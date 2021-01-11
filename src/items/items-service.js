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
            .then(rows => rows[0])
    },
    deleteItem(db, id) {
        return db('items')
            .where({id: id})
            .delete()
    },
    updateItem(db, id, data){
        return db('items')
            .where({id: id})
            .update(data)
    }
}

module.exports = ItemsService;

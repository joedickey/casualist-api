const ListsService = {
    createList(db, data) {
        return db('lists')
            .insert(data)
            .returning('*')
            .then(rows => rows[0])
    }
}

module.exports = ListsService;

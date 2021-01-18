const express = require('express');
const xss = require('xss');
const ListsService = require('./lists-service');

const listsRouter = express.Router();
const jsonParser = express.json();

const serializeList = list => ({
    id: list.id,
    url_path: list.url_path, // replace id on client side and index in db
    name: xss(list.name),
    item_order: list.item_order,
    
});

const serializeItem = item => ({
    id: item.id,
    list_id: item.list_id,
    name: xss(item.name),
    assign: xss(item.assign),
    status: item.status,
    notes: xss(item.notes)
});

listsRouter
    .route('/:url_path') // add .all route to make sure list exists
    .all((req, res, next) => {
        const knexInstance = req.app.get('db');
        const urlPath = req.params.url_path;

        ListsService.getList(knexInstance, urlPath)
            .then(list => {
                if(!list) {
                    return res.status(404).json({
                        error: {message: 'List does not exist'}
                    });
                }
                res.list = list;
                next();
            })
            .catch(next);
    })
    .get((req, res, next) => {
        res.json(serializeList(res.list));
    })
    .patch(jsonParser, (req, res, next) => {
        const knexInstance = req.app.get('db');
        const urlPath = req.params.url_path;
        const { name, item_order } = req.body;
        const listToUpdate = { name, item_order };

        const numberOfValues = Object.values(listToUpdate).filter(Boolean).length;
        if(numberOfValues === 0) 
            return res.status(400).json({
                error: { message: `Request body must contain updated content`}
            });
        
        ListsService.updateList(knexInstance, urlPath, listToUpdate)
            .then(numRowsAffected => {
                res.status(204).end();
            })
            .catch(next);

    })
    .delete((req, res, next) => { // not used clientside but created anyways
        const knexInstance = req.app.get('db');
        const urlPath = req.params.url_path;
        const listId = res.list.id;

        ListsService.getListItems(knexInstance, listId)
            .then(data => {
                const saniArry = [];
                data.forEach(item => {
                    saniArry.push(serializeItem(item));
                }); 

                if(saniArry == '') {
                    ListsService.deleteList(knexInstance, urlPath)
                        .then(numRowsAffected => {
                            return res.status(204).end();
                        });
                }

                else return res.status(400).json({
                    error: { message: `Cannot delete list because of associated items.`}
                });
            })
            .catch(next);
    });

listsRouter
    .route('/listitems/:list_id')
    .all((req, res, next) => {
        const knexInstance = req.app.get('db');
        const list_id = req.params.list_id;

        ListsService.getListById(knexInstance, list_id)
            .then(list => {
                if(!list) {
                    return res.status(404).json({
                        error: {message: 'List does not exist'}
                    });
                }
                res.list = list;
                next();
            })
            .catch(next);
    })
    .get((req, res, next) => {
        const knexInstance = req.app.get('db');
        const list_id = res.list.id;

        ListsService.getListItems(knexInstance, list_id)
            .then(data => {
                const saniArry = [];
                data.forEach(item => {
                    saniArry.push(serializeItem(item));
                }); 
                res.json(saniArry);
            })
            .catch(next);
    });
    

listsRouter
    .route('/')
    .post(jsonParser, (req, res, next) => {
        const knexInstance = req.app.get('db');
        const { url_path, name, item_order } = req.body;
        const newList = {url_path, name, item_order};

        for(const [key, value] of Object.entries(newList))
            if(value == null)
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                });

        ListsService.createList(knexInstance, newList )
            .then(list => {
                res.status(201)
                    .json(serializeList(list));
            })
            .catch(next);
    });

module.exports = listsRouter;
const express = require('express')
const xss = require('xss')
const ListsService = require('./lists-service')

const listsRouter = express.Router()
const jsonParser = express.json()

const serializeList = list => ({
    id: list.id,
    url_path: list.url_path, // replace id on client side and index in db
    name: xss(list.name),
    item_order: list.item_order,
    
})

const serializeItem = item => ({
    id: item.id,
    list_id: item.list_id,
    name: xss(item.name),
    assign: xss(item.assign),
    status: item.status,
    notes: xss(item.notes)
})

listsRouter
    .route('/:url_path') // add .all route to make sure list exists
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        const urlPath = req.params.url_path

        ListsService.getList(knexInstance, urlPath)
            .then(list => res.json(serializeList(list)))
            .catch(next)
            

    })
    .patch(jsonParser, (req, res, next) => {
        res.status(204)
            .end()
            .catch(next)
    })
    .delete((req, res, next) => {
        const knexInstance = req.app.get('db')
        const urlPath = req.params.url_path

        ListsService.deleteList(knexInstance, urlPath)
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })

listsRouter
    .route('/listitems/:list_id')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        const list_id = req.params.list_id

        ListsService.getListItems(knexInstance, list_id)
            .then(data => res.json(data))  //serialize?
            .catch(next)
    })
    

listsRouter
    .route('/')
    .post(jsonParser, (req, res, next) => {
        const knexInstance = req.app.get('db')
        const { url_path, name, item_order  } = req.body
        const newList = {url_path, name, item_order}

        for(const [key, value] of Object.entries(newList))
            if(value == null)
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })

        ListsService.createList(knexInstance, newList )
                .then(list => {
                    res.status(201)
                        .json(serializeList(list))
                })
                .catch(next)
    })

module.exports = listsRouter;
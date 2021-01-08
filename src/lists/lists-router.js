const express = require('express')
const xss = require('xss')
const ListsService = require('./lists-service')

const listsRouter = express.Router()
const jsonParser = express.json()

const serializeList = list => ({
    id: list.id,
    url_path: list.url_path, // replace id on client side and index in db
    name: xss(list.name),
    item_order: list.item_order
})

listsRouter
    .route('/:list_id') // add .all route to make sure list exists
    .get((req, res, next) => {
        res.status(200)
            .send(`Successful GET of list: ${req.params.list_id}`)
            .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        res.status(204)
            .end()
            .catch(next)
    })
    .delete((req, res, next) => {
        res.status(204)
            .end()
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
const express = require('express')
const xss = require('xss')

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
        res.status(201)
            .send('Successful POST')
            .catch(next)
    })

module.exports = listsRouter;
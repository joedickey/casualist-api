const express = require('express')
const xss = require('xss')

const itemsRouter = express.Router()
const jsonParser = express.json()

const serializeItem = item => ({
    id: item.id,
    list_id: item.list_id,
    name: xss(item.name),
    assign: xss(item.assign),
    status: item.status,
    notes: xss(item.notes)
})

itemsRouter
    .route('/:item_id') // add .all route to make sure item exists
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
    

itemsRouter
    .route('/')
    .post(jsonParser, (req, res, next) => {
        res.status(201)
            .send('Successful POST')
            .catch(next)
    })

module.exports = itemsRouter;
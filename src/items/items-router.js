const express = require('express')
const xss = require('xss')
const ItemsService = require('./items-service')

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
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        const itemId = req.params.item_id

        ItemsService.getItem(knexInstance, itemId)
            .then(data => res.json(data))
            .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        res.status(204)
            .end()
            .catch(next)
    })
    .delete((req, res, next) => {
        const knexInstance = req.app.get('db')
        const itemId = req.params.item_id

        ItemsService.deleteItem(knexInstance, itemId)
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })
    

itemsRouter
    .route('/')
    .post(jsonParser, (req, res, next) => {
        const knexInstance = req.app.get('db')
        const { list_id, name, assign, notes  } = req.body
        const newItem = {list_id, name, assign, notes}

        for(const [key, value] of Object.entries(newItem))
            if(value == null)
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })

        ItemsService.createItem(knexInstance, newItem )
                .then(item => {
                    res.status(201)
                        .json(serializeItem(item))
                })
                .catch(next)
    })

module.exports = itemsRouter;
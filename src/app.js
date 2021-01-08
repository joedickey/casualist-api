require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV, ClIENT_ORIGIN, API_TOKEN } = require('./config')
const listsRouter = require('./lists/lists-router')
const itemsRouter = require('./items/items-router')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(
    cors({
        origin: ClIENT_ORIGIN
    })
)

app.use(function validateBearerToken(req, res, next) {
    const authToken = req.get('Authorization')
  
    if (!authToken || authToken.split(' ')[1] !== API_TOKEN) {
      return res.status(401).json({ error: 'Unauthorized request' })
    }
    next()
  })

app.use('/api/lists', listsRouter)
app.use('/api/items', itemsRouter)


app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
 })

module.exports = app
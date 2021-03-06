require('dotenv').config();
require('newrelic');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV, API_TOKEN } = require('./config');
const listsRouter = require('./lists/lists-router');
const itemsRouter = require('./items/items-router');

const app = express();

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';

const corsOptions = {
    origin: 'https://casualist.vercel.app'
};

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors(corsOptions));

app.use(function validateBearerToken(req, res, next) {
    const authToken = req.get('Authorization');
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // sort of hacky approach but couldn't get passed 'no pg_hba.conf entry' error after deploy to Heroku
    if (!authToken || authToken.split(' ')[1] !== API_TOKEN) {
        return res.status(401).json({ error: 'Unauthorized request' });
    }
    next();
});

app.use('/api/lists', listsRouter);
app.use('/api/items', itemsRouter);


app.use(function errorHandler(error, req, res, next) { // handles any uncaught errors
    let response;
    if (NODE_ENV !== 'production') {
        response = { error: { message: 'server error' } };
    } else {
        console.error(error);
        response = { message: error.message, error };
    }
    res.status(500).json(response);
});

module.exports = app;
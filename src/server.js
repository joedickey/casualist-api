const express = require('express');
const app = require('./app')
const { PORT} = require('./config')

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports = {app};
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const router = require('./routes');
require('dotenv').config();

app.use(bodyParser.json());
app.use('/', router);

const port = process.env.PORT;
const server = app.listen(port, (req, res) => {
    console.log(`Server running on port: ${port}`);
});

module.exports = server;
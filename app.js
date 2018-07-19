'use strict';
const express = require('express');
const app = express();

const router = require('./routes');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require('cookie-parser')());
app.use(router);


app.listen(8082, () => 
{
    console.log('Example app listening on port 8082!');
});
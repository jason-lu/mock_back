'use strict';
const express = require('express');
const app = express();
const passport = require('passport');

const router = require('./routes');
const path = require('path');

const bodyParser = require('body-parser');
app.use(passport.initialize());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require('cookie-parser')());
app.use(express.static('mockfront'))
//All restful apis go here
app.use('/api', router);
app.use('*', function(req,res) {
    res.sendfile(path.join(__dirname + '/mockfront/index.html'));
})


app.listen(8082, () => 
{
    console.log('Example app listening on port 8082!');
});
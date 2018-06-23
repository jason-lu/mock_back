'use strict';
const express = require('express');
const app = express();
const db = require('./db');
const config = require('./config');
//加密
const secrets = config.secrets;
const saltRounds = 10;
const salt = secrets.salt;
var bcrypt = require('bcrypt');

const auth = require('./authentication/auth');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('cookie-parser')());



// app.use(express.static('mockfront'));

app.get('/login', (req,res) => {
    res.sendFile('auth.html', { root : __dirname+'/mockfront'})
});

app.get('/profile',
require('connect-ensure-login').ensureLoggedIn(),
(req,res) => {
    res.sendFile('profile.html', { root : __dirname+'/mockfront'});
});

app.get('/', (req, res) => res.sendFile('index.html', { root : __dirname+'/mockfront'}));

app.get('/m1', function (req,res)
{ 
    res.send(req.toString());
});

app.post('/m2', (req,res) => {
    console.log(req.body);
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
            if(!err) {
                db.addUser(req.body.username,req.body.email,hash);
                res.json({m2: 'success'});
            } else {
                console.log(err.stack);
            }
        });
    });
});

app.post('/m3',function(req,res) {
    auth.auth(req.body.username, req.body.password, function(err,token){
        if(err) throw err;
        var message = {}
        if(token) {
            message.status = "success";
            message.token = token;
        } else {
            message.status = "fail";
            message.token = null;
        }
        res.json(message);
    });
});

// app.post('/m4',
// auth.passport.authenticate('local'),
//     (req,res) => {
//         console.log(req.isAuthenticated());
//         res.json({messagw: "hello"});
//     }
// );


app.listen(8082, () => 
{
    console.log('Example app listening on port 8082!');
});
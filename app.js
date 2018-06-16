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
app.use(require('express-session')({ secret: salt, resave: false, saveUninitialized: false }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(auth.passport.initialize());
app.use(auth.passport.session());


// app.use(express.static('mockfront'));

app.get('/login', (req,res) => {
    res.sendFile('auth.html', { root : __dirname+'/mockfront'})
});



app.get('/', (req, res) => res.sendFile('index.html', { root : __dirname+'/mockfront'}));

app.get('/m1', function (req,res)
{ 
    res.send(req.toString());
});

app.post('/m2', (req,res) => {
    console.log(req.body);
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash('password', salt, function(err, hash) {
            if(!err) {
                db.addUser('kuan','kuan@exapmle.com',hash);
                res.json({m2: 'success'});
            } else {
                console.log(err.stack);
            }
        });
    });
});

app.post('/m3',
    auth.passport.authenticate('local'),
    function(req,res){
        res.redirect('/');
    }
);


app.listen(8082, () => 
{
    console.log('Example app listening on port 8082!');
});
'use strict';

const express = require('express');
const router = express.Router();
//db && config files
const db = require('../db');
const config = require('../config');
//encryption
const secrets = config.secrets;
const saltRounds = 10;
const salt = secrets.salt;
var bcrypt = require('bcrypt');

const auth = require('../authentication/auth');


//need authentication for accessing
router.get('/profile',function(req,res) {
    res.sendFile('profile.html', { root : __dirname+'/mockfront'});
});

router.get('/m1', function (req,res)
{ 
    res.send(req.toString());
});

router.post('/m2', (req,res) => {
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
            if(!err) {
                db.addUser(req.body.username,req.body.email,hash, function(user){
                    res.json({m2: 'success'});
                });
               
            } else {
                console.log(err.stack);
                return res.status(500).send("There was a problem registering the user.");
            }
        });
    });
});

router.post('/m3',function(req,res) {
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

router.post('/m4', function(req, res) {
    var token = req.headers['x-access-token'];

    auth.authZ(token,function(err,decoded){
        console.log(err);
        if(!err) {
            return res.json(decoded);
        }
        return res.status(401).send({ auth: false, message: 'No token provided.' });
    })
    
});

module.exports = router
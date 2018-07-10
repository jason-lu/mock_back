const jwt = require('jsonwebtoken');
const db = require('../db');
const bcrypt = require('bcrypt');
const config = require('../config/index');

const auth = function(username, password, cb) {
    db.findByUsername(username,function(user) {

        if(!user) {
            cb(null, false);
            return;
        }

        bcrypt.compare(password, user.password, function(err, res) {
            if(err != undefined) {
                console.log('bcrypt err');
                cb(null,false);
                return;
            } else {
                console.log(res);
                if(res) {
                    console.log('bcrypt success');
                    const payload = {
                        user: user.username,
                        email: user.email
                    };
                    var token = jwt.sign(payload, config.secrets.salt , {
                        expiresIn: 86400 // expires in 24 hours
                    });
                    cb(null, token); 
                } else {
                    cb(null,false);
                }
            }
        });
    });
}

var authZ = function(token, cb) {
    console.log(token);
    jwt.verify(token, config.secrets.salt, function(err,decoded) {
        if(err) {
            cb(true, null);
        } else {
            console.log("ok")
            cb(false, decoded);
        }
    });
}

exports.auth = auth;
exports.authZ = authZ;
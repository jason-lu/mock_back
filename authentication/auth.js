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
                    var token = jwt.sign(payload, config.secrets.secret , {
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

exports.auth = auth;
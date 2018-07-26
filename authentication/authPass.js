const jwt = require('jsonwebtoken');
const db = require('../db');
const bcrypt = require('bcrypt');
const config = require('../config/index');

const passport = require('passport');
const passportJWT = require("passport-jwt");
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
jwtOptions.secretOrKey = config.secrets.salt;


//authorization strategy
const strategy = new JwtStrategy(jwtOptions, function(payload, next){
    db.findByUsername(payload.user, function(user){
        console.log(user);
        if(!user) {
            next(false);
        } else {
            next(null, payload);
        }
    });
});

passport.use(strategy);

//login
const login = function(username, password, cb) {
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

exports.login = login;
exports.authPass = passport;


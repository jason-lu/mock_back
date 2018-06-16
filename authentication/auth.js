const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const db = require('../db');
const bcrypt = require('bcrypt');

passport.use(new Strategy(
    function(username, password, cb) {
        db.findByUsername(username, function(err,user){
            if(err) {
                consoel.log('err @ strategy');
                return cb(err);
            }
            if(!user) {
                consoel.log('err @ db find');
                return cb(null, false)
            }

            bcrypt.compare(password,user.password, function(err,res){
                
                if(err != undefined) {
                    console.log('bcrypt err');
                    return cb(null,false);
                } else {
                    if(res) {
                        console.log('bcrypt success');
                        return cb(null, user); 
                    } else {
                        return cb(null,false);
                    }
                }
            });
        })
    
}));

passport.serializeUser(function(user, cb) {
    cb(null, user.username);
  });
  
  passport.deserializeUser(function(username, cb) {
    db.findByUsername(username, function (err, user) {
      if (err) { return cb(err); }
      cb(null, user);
    });
  });

exports.passport = passport;
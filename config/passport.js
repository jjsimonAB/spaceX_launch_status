const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const passport = require('passport');
const User = require('../models/User');

passport.use(
    new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, (email, password, done) => {
        User.findOne({
            email: email
        })
        .then(user => {
            if(!user){
                return done(null, false, { message: "User not register"});
            }

            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err) throw err;

                if(isMatch){
                    console.log('success');
                    return done(null, user);
                }else{
                    return done(null, false, { message: "User incorrect" })
                }

            });
        })
        .catch(err => console.log(err))
    })
);


passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET
    }, (jwtPayLoad, cb) => {
        return User.findOne({ _id: jwtPayLoad._id})
            .then(user => {
                console.log(user);
                return cb(null, user);
            })
            .catch(err => {
                console.error(err);

                return cb(err);
            })
    }
))





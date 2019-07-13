const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

class Auth {

    static register(args) {
        let errors = [];
        let {password, password2} = args;
        
        if(password !== password2){
            errors.push({
                msg: "Passwords do not match"
            })

            console.log(errors);

            return errors;
        }

        bcrypt.hash(password, 10, (err, hash) => {
            console.log(hash);

            const vals = {
                name: args.name,
                email: args.email,
                password: hash
            }

            let newUser = User({...vals});

            User.find({email: args.email}, (err, data) => {
                if(err) throw err;
    
                if(data.length > 0){
                    errors.push({msg: "Usuario ya existe"});
                    console.log(errors);
                    return false;
                }else {
                    newUser.save()
                        .then(r => {
                            console.log(r)
                            return true;
                        })
                        .catch(err => {
                            console.log(err);
                        return false;
                    })
    
                }
            })
        })

        
    }

    static login(args) {
        let { email, password } = args;

        
        User.find({
            email: email
        }, (err, data) => {
            if(err) throw err;
            if(data.length > 0){
                bcrypt.compare(data.password, password, (err, res) => {
                    if (res){
                        let token = jwt.sign(...args, process.env.JWT_SECRET, { expiresIn: '1d'});
                        console.log(token);

                    }else {
                        console.log("Password or account are incorrect!");
                        return "nada";
                    }
                })
            }else {
                console.log("user do not exist found");
            }
        })
    }

}

module.exports = Auth;
const user = require('../models/user');
const bcrypt = require('bcrypt');
const saltRounds = parseInt(process.env.SALT_ROUNDS);
const joi = require('joi');
const customErrorHandlers = require('../utils/error');
let jwt = require('jsonwebtoken');
let privateKey = process.env.PRIVATE_KEY;

exports.registerUser = (req, res, next) => {
    user.userSchema.validateAsync(req.body).then((value) => {
            const password = req.body.password;
            console.log(password);
            bcrypt.hash(password, saltRounds, (err, hash) => {
                        value.password = hash;
                        console.log(value);
                        user.createUser(value, (err, data) => {
                if(err){
                    console.log(err);
                    res.status(400).json(err);
                }
                else{
                    res.status(201).json(data);
                }
            });
        });
    }).catch(err => {
        console.log(err);
        res.status(400).json({'error': err});
    });
};

const authenticate = (req, res, next, query, callbackObject1) => {
    user.getUserByQuery({'query': query, 'value': req.body.login}, (err, data) => {
        if(err != null){
            console.log(err);
            res.status(400).json(err);
        }
        else{
                const resultObject = data[0];
                bcrypt.compare(req.body.password, resultObject.password, (err, result) => {
                    if(err){
                        res.status(404).json({'error': 'Error with bcrypt'});
                    }
                    else{
                        callbackObject1(resultObject.username, null);
                        return;
                    }
                });
            }
    });
};

exports.loginUser = (req, res, next) => {
    console.log(privateKey);
    loginQuery = req.body.login;
    joi.string().email().validateAsync(loginQuery).then((value) => {
        authenticate(req, res, next, 'email', (value, error) => {
            jwt.sign({'username': value}, privateKey, { expiresIn: '1h' }, (err, token) => {
                res.status(200).json({'token': token});
            });
        });
    }).catch((err) => {
        const isNotEmail = customErrorHandlers.notEmailErrorHandler(err);
        if(isNotEmail){
            authenticate(req, res, next, 'username',(value, error) => {   
            jwt.sign({'username': value} , privateKey, { expiresIn: '1h'}, (err, token) => {
                console.log('username: ' + value)
                console.log(token);
                res.status(200).json({'token': token});
            });
            });
            
        }
        else{
            console.log(err);
            res.status(400).json(err);
        }
    });
};
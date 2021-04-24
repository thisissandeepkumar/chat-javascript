const user = require('../models/user');
let jwt = require('jsonwebtoken');

const privateKey = process.env.PRIVATE_KEY;

const auth = (req, res, next) => {
    const token = req.headers.authorization;
    if(token){
        jwt.verify(token, privateKey, (err, decoded) => {
            if(err){
                res.status(475).json({'error': 'token invalid', 'message': err});
            }
            else{
                console.log(decoded);
                user.getUserByQuery({'query': 'username', 'value': decoded.username}, (err, data) => {
                    if(err){
                        res.status(474).json({'error': 'user model error'});
                    }
                    else{
                        req.user = data[0];
                        next();
                    }
                });
            }
        });
    }
    else{
        res.status(408).json({'error': 'unauthorized request'});
    }
};

module.exports = auth;
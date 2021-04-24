const chatroom = require('../models/chatroom');
const joi = require('joi');
const errorHandler = require('../utils/error');
const userModel = require('../models/user');

exports.createChatroom = (req, res, next) => {
    let user2Object;
    joi.string().email().validateAsync(req.body.query).then(value => {
        userModel.getUserByQuery({'query': 'email', 'value': value}, (err, data) => {
            if(err != null){
                res.status(400).json({"error": "Something went wrong"});
            }
            else{
                user2Object = data[0];
                console.log(user2Object);
            }
            if(req.user.id === user2Object.id){
                res.status(408).json({"error": "Cannot add same users"});
            }
            else{
                const newChatroom = {
        user1: req.user.id < user2Object.id? req.user.id : user2Object.id,
        user2: req.user.id > user2Object.id? req.user.id : user2Object.id,
    };
    chatroom.chatroomSchema.validateAsync(newChatroom).then(value => {
        chatroom.createChatroom(value, (err, data) => {
            errorHandler.handleCreatedData(req, res, next, err, data);
        });
    });
            }
        });
    }).catch(err => {
        const validationResult = errorHandler.notEmailErrorHandler(err);
        if(validationResult){
            userModel.getUserByQuery({'query': 'username', 'value': req.body.query}, (err, data) => {
            if(err != null){
                res.status(400).json({"error": "Something went wrong"});
            }
            else{
                user2Object = data[0];
                console.log(user2Object);
            }
            if(req.user.id === user2Object.id){
                res.status(408).json({"error": "Cannot add same users"});
            }
            else{
                const newChatroom = {
        user1: req.user.id < user2Object.id? req.user.id : user2Object.id,
        user2: req.user.id > user2Object.id? req.user.id : user2Object.id,
    };
    chatroom.chatroomSchema.validateAsync(newChatroom).then(value => {
        chatroom.createChatroom(value, (err, data) => {
            errorHandler.handleCreatedData(req, res, next, err, data);
        });
    });
            }
        });
        }
    });
    // const newChatroom = {
    //     user1: req.user.id,
    //     user2: user2Object.id,
    // };
    // chatroom.chatroomSchema.validateAsync(newChatroom).then(value => {
    //     chatroom.createChatroom(value, (err, data) => {
    //         errorHandler.handleCreatedData(req, res, next, err, data);
    //     });
    // });
};

exports.getChatrooms = (req, res, next) => {
    // chatroom.getAllChatroomByUserId(req.user.id, (err, data) => {
    //     errorHandler.handleGetData(req, res, next, err, data);
    // });
    chatroom.getChatroomsWithUserInfoById(req.user.id, (err, data) => {
        if(err){
            res.status(400).json(err);
        }
        else{
            console.log('Correct');
            res.status(200).json(data);
        }
    });
};

exports.deleteChatroom = (req, res, next) => {
    chatroom.deleteChatroomById(req.params.id, (err, data) => {
        errorHandler.handleCreatedData(req, res, next, err, data);
    });
};
const chatroom = require('../models/chatroom');
const joi = require('joi');
const errorHandler = require('../utils/error');

exports.createChatroom = (req, res, next) => {
    const newChatroom = {
        user1: req.user.id,
        user2: req.body.user2,
    };
    chatroom.chatroomSchema.validateAsync(newChatroom).then(value => {
        chatroom.createChatroom(value, (err, data) => {
            errorHandler.handleCreatedData(req, res, next, err, data);
        });
    });
};

exports.getChatrooms = (req, res, next) => {
    chatroom.getAllChatroomByUserId(req.user.id, (err, data) => {
        errorHandler.handleGetData(req, res, next, err, data);
    });
};

exports.deleteChatroom = (req, res, next) => {
    chatroom.deleteChatroomById(req.params.id, (err, data) => {
        errorHandler.handleCreatedData(req, res, next, err, data);
    });
};
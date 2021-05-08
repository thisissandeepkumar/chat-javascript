const message = require('../models/message');
const error = require('../utils/error');
const io = require('../socket');
const chatroomModel = require('../models/chatroom');
const fcmModel = require('../models/fcm');
var FCM = require('fcm-node');
const { response } = require('express');
var serveKey = process.env.FCM_KEY;
var fcm = new FCM(serveKey);
const userModel = require('../models/user');

module.exports.sendMessage = (req, res, next) => {
    id = req.params.id;
    message.messageSchema.validateAsync({chatroom_id: parseInt(id), sender_id: req.user.id, content: req.body.content, }).then((value) => {
        message.createMessage(value, (err, data) => {
            if(err == null){
                io.getIO().to(parseInt(id).toString()).emit("new",{
                    'id': data.insertId,
                    'sender_id': req.user.id,
                    'content': req.body.content
                });
            }
            chatroomModel.getChatroomByID(id, (err, data) => {
                if(err != null){
                    console.log(err);
                }
                else{
                    userModel.getUserByQuery({'query': 'id', 'value': req.user.id}, (err, userRes) => {
                        if(err!=null){
                            console.log(err);
                        }
                        else{
                            receiverID = data.user1 == req.user.id? data.user2 : data.user1;
                    fcmModel.getTokenByUser(receiverID, (err, data) => {
                        if(err!=null){
                            console.log(err);
                        }
                        else{
                            const tokens = data;
                            tokens.forEach((item) => {
                                let message = {
                                    to: item.token,
                                    notification: {
                                        title: userRes[0].firstname + ' ' + userRes[0].lastname,
                                        body: req.body.content
                                    }
                                };
                                fcm.send(message, (err, reponse) => {
                                    if(err){
                                        console.log(err);
                                    }
                                    else{
                                        console.log(response);
                                        console.log("Sent!");
                                    }
                                });
                            });
                        }
                    });
                        }
                    });
                    
                }
            });
            error.handleCreatedData(req, res, next, err, data);
        });
    }).catch(error =>{
        res.status(401).json({'error': error});
    });
    
};

module.exports.getMessagesByChatroomId = (req, res, next) => {
    id = req.params.id;
    message.getAllMessagesById(id, (err, data) => {
        error.handleGetData(req, res, next, err, data);
    });
};
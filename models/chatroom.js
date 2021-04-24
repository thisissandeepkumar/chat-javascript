const sql = require('../utils/db');
const joi = require('joi');
const moment = require('moment');

const chatroomSchema = joi.object({
    user1: joi.number(),
    user2: joi.number(),
});

const createChatroom = (chatroom, result) => {
    sql.query("INSERT INTO chatroom SET ?", chatroom, (err, res) => {
        if(err){
            result(err, null);
            return;
        }
        else{
            result(null, res);
            return;
        }
    });
};

const getAllChatroomByUserId = (id, result) => {
    sql.query("SELECT * FROM chatroom WHERE user1 = ? OR user2 = ?", [id, id], (err, res) => {
        if(err){
            result(err, null);
            return;
        }
        else{
            result(null, res);
            return;
        }
    });
};

const deleteChatroomById = (id, result) => {
    sql.query("UPDATE chatroom SET chatroom.deleted = ? WHERE id = ?", [moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),  parseInt(id)], (err, res) => {
        if(err){
            console.log(err);
            result(err, null);
            return;
        }
        else{
            result(null, res);
            return;
        }
    });
};

const getChatroomsWithUserInfoById = (id, result) => {
    sql.query("SELECT ch.*, us1.firstname as firstname_sender, us1.lastname as lastname_sender, us1.username as username_sender , us1.email as email_sender,us2.firstname as firstname_receiver, us2.lastname as lastname_receiver, us2.username as username_receiver , us2.email as email_receiver FROM chatroom ch LEFT JOIN user us1 ON ch.user1 = us1.id LEFT JOIN user us2 ON ch.user2 = us2.id WHERE ch.user1 = ? OR ch.user2 = ?", [id, id], (err, res) => {
        if(err){
            result(err, null);
            return;
        }
        else{
            console.log(res);
            result(null, res);
            return;
        }
    });
};

module.exports = {
    chatroomSchema,
    createChatroom,
    getAllChatroomByUserId,
    deleteChatroomById,
    getChatroomsWithUserInfoById
};
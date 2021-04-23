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

module.exports = {
    chatroomSchema,
    createChatroom,
    getAllChatroomByUserId,
    deleteChatroomById
};
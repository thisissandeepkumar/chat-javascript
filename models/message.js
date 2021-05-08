const sql = require('../utils/db');
const joi = require('joi');

const messageSchema = joi.object({
    chatroom_id: joi.number(),
    sender_id: joi.number(),
    content: joi.string(),
});

const createMessage = (message, result) => {
    sql.query("INSERT INTO message SET ?", message, (err, res) => {
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

const getAllMessagesById = (id, result) => {
    sql.query("SELECT * FROM message WHERE chatroom_id = ?", id, (err, res) => {
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

const updateMessageById = (queryObject, result) => {
    sql.query("UPDATE message SET " + queryObject.column + " = " + queryObject.newVal + " WHERE message." + queryObject.query + " = " + queryObject.value, (err, res) => {
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

const updateAllWhereQuery = (queryObject, result) => {
    console.log(queryObject);
    sql.query("UPDATE message SET " + queryObject.column +" = " + queryObject.newVal + " WHERE message.sender_id !=" + queryObject.currentUser +" AND message."+ queryObject.query + " = " + queryObject.value, (err, res) => {
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

const deleteMessage = (id, result) => {
    sql.query("DELETE message WHERE id = ?", id, (err, res) => {
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

module.exports = {
    messageSchema,
    createMessage,
    getAllMessagesById,
    updateMessageById,
    deleteMessage,
    updateAllWhereQuery
};
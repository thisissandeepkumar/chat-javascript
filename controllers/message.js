const message = require('../models/message');
const error = require('../utils/error');
const io = require('../socket');

module.exports.sendMessage = (req, res, next) => {
    id = req.params.id;
    message.messageSchema.validateAsync({chatroom_id: parseInt(id), sender_id: req.user.id, content: req.body.content}).then((value) => {
        message.createMessage(value, (err, data) => {
            if(err == null){
                io.getIO().to(parseInt(id).toString()).emit("new",{
                    'id': data.insertId,
                    'sender_id': req.user.id,
                    'content': req.body.content
                });
            }
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
require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const http = require('http');
const server = http.createServer();
let jwt = require('jsonwebtoken');
const privateKey = process.env.PRIVATE_KEY;
// Middleware Imports
const auth = require('./middlewares/auth');

const userModel = require('./models/user');
const messageModel = require('./models/message');
// Router Imports
const userRouter = require('./routes/user');
const chatroomRouter = require('./routes/chatroom');
const messageRouter = require('./routes/message');

// Middlewares
app.use(bodyParser.json());


// Routing
app.use('/auth', userRouter);
app.use('/chatroom', auth ,chatroomRouter);
app.use('/message', auth, messageRouter);


let ws = new WebSocket.Server(
    {port: process.env.SOCKET_PORT}
);

const authenticate = (token, result) => {
    if(token != null){
        jwt.verify(token, privateKey, (err, decoded) => {
            if(err){
                result(err, null);
                return;
            }
            else{
                userModel.getUserByQuery({'query': 'username', 'value': decoded.username}, (err, data) => {
                    if(err){
                        result(err, null);
                        return;
                    }
                    else{
                        result(null, data[0]);
                        return;
                    }
                })
            }
        });
    }
    else{
        result("token not found", null);
        return;
    }
};

ws.on('connection', (client) => {
    console.log('Client Connected!');
    client.send('connected');
    client.on('message', (message) => {
        const messageObject = JSON.parse(message);
        authenticate(messageObject.token, (err, data) => {
            if(err){
                client.close();
            }
            else{
                messageModel.messageSchema.validateAsync({chatroom_id: parseInt(messageObject.chatroom), sender_id: data.id, content: messageObject.content}).then((value) => {
            
        messageModel.createMessage(value, (err, data) => {
            if(err == null){
            const messageBody = {
                "id": data.insertId,
                "content": messageObject.content,
                "chatroom": messageObject.chatroom,
                "sender": data.insertId
            };
            console.log(messageBody);
            for (let cl of ws.clients){
                cl.send(JSON.stringify(messageBody));
        }}
        });
    }).catch(error =>{
        res.status(401).json({'error': error});
    });
                
            }
        });
        

    });
});

// const server = app.listen(process.env.APP_PORT || 3000);
// const io = require('./socket').init(server);
// io.on('connection', socket => {
//     console.log('Client Connected!');
// });
app.listen(process.env.APP_PORT || 3000);
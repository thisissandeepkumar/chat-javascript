require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const http = require('http');
const server = http.createServer();
let jwt = require('jsonwebtoken');
const privateKey = process.env.PRIVATE_KEY;

// Model Imports
const messageModel = require('./models/message');
const userModel = require('./models/user');


// Middleware Imports
const auth = require('./middlewares/auth');
let cors = require('cors');

// Router Imports
const userRouter = require('./routes/user');
const chatroomRouter = require('./routes/chatroom');
const messageRouter = require('./routes/message');

// Middlewares
app.use(cors());
app.use(bodyParser.json());


// Routing
app.use('/auth', userRouter);
app.use('/chatroom', auth ,chatroomRouter);
app.use('/message', auth, messageRouter);


// let ws = new WebSocket.Server(
//     {port: process.env.SOCKET_PORT}
// );

// const authenticate = (token, result) => {
//     if(token != null){
//         jwt.verify(token, privateKey, (err, decoded) => {
//             if(err){
//                 result(err, null);
//                 return;
//             }
//             else{
//                 userModel.getUserByQuery({'query': 'username', 'value': decoded.username}, (err, data) => {
//                     if(err){
//                         result(err, null);
//                         return;
//                     }
//                     else{
//                         result(null, data[0]);
//                         return;
//                     }
//                 })
//             }
//         });
//     }
//     else{
//         result("token not found", null);
//         return;
//     }
// };

// ws.on('connection', (client) => {
//     console.log('Client Connected!');
//     client.send('connected');
//     client.on('message', (message) => {
//         const messageObject = JSON.parse(message);
//         authenticate(messageObject.token, (err, data) => {
//             if(err){
//                 client.close();
//             }
//             else{
//                 messageModel.messageSchema.validateAsync({chatroom_id: parseInt(messageObject.chatroom), sender_id: data.id, content: messageObject.content}).then((value) => {
            
//         messageModel.createMessage(value, (err, data) => {
//             if(err == null){
//             const messageBody = {
//                 "id": data.insertId,
//                 "content": messageObject.content,
//                 "chatroom": messageObject.chatroom,
//                 "sender": data.insertId
//             };
//             console.log(messageBody);
//             for (let cl of ws.clients){
//                 cl.send(JSON.stringify(messageBody));
//         }}
//         });
//     }).catch(error =>{
//         res.status(401).json({'error': error});
//     });
                
//             }
//         });
        

//     });
// });

// const server = app.listen(process.env.APP_PORT || 3000);
// const io = require('./socket').init(server);
// io.on('connection', socket => {
//     console.log('Client Connected!');
// });

const io = require('./socket').init(process.env.SOCKET_PORT || 4545);

io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if(token != null){
        jwt.verify(token, privateKey, (err, decoded) => {
        if(err != null){
            console.log('Error!');
            socket.disconnect();
        }
        else{
            console.log("Socket authenticated!");
            userModel.getUserByQuery({'query': 'username', 'value': decoded.username}, (err, userData) => {
                if(!err){
                    socket.request.user = userData[0];
                }
                else{
                    socket.disconnect();
                }
            });
            next();
        }
    });
    }
    else{
        console.log('Error in receiving token!');
        socket.disconnect();
    }
});

io.on("connection", socket => {
    console.log("Client Connected!");
    socket.send("Connected!");
    const roomID = socket.handshake.auth.room;
    console.log(roomID);
    socket.join(roomID);
    socket.on("all",(newData) => {
        messageModel.updateAllWhereQuery({'query': 'chatroom_id', 'value': newData.room, 'column': 'isread', 'newVal': 1, 'currentUser': newData.user}, (err, data) => {
             if(err){
                console.log(err);
            }
            else{
                console.log(data);
                socket.broadcast.emit("all", newData);
            }
        });
    } );
    socket.on("read", (newData) => {
        messageModel.updateMessageById({'query': 'id', 'value': newData.id, 'column': 'isread', 'newVal': 1}, (err, data) => {
            if(err){
                console.log(err);
            }
            else{
                console.log(data);
                socket.broadcast.emit("read", newData);
            }
        });
    } );
});

app.listen(process.env.APP_PORT || 3000);
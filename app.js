require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const WebSocket = require('ws');

// Middleware Imports
const auth = require('./middlewares/auth');

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

let server = new WebSocket.Server(
    {
        port: process.env.SOCKET_PORT
    }
);

server.on('connection', (client) => {
    console.log('Client Connected!');
    client.send('connected');
    client.on('message', (message) => {
        const messageObject = JSON.parse(message);
        console.log(messageObject.message);
        for (let cl of server.clients){
            cl.send(messageObject.message);
        }

    });
});
// const server = app.listen(process.env.APP_PORT || 3000);
// const io = require('./socket').init(server);
// io.on('connection', socket => {
//     console.log('Client Connected!');
// });
app.listen(process.env.APP_PORT || 3000);
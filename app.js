require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

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


app.listen(process.env.APP_PORT || 3000);
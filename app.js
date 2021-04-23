require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Router Imports
const userRouter = require('./routes/user');


// Middlewares
app.use(bodyParser.json());


// Routing
app.use('/auth', userRouter);



app.listen(process.env.APP_PORT || 3000);
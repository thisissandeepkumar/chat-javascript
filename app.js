require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser');




app.listen(process.env.APP_PORT || 3000);
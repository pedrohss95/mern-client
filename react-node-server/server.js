const express = require('express')
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config()

const app = express()

//connect db

mongoose.connect(process.env.DATABASE_CLOUD, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
.then(() => console.log('DB connected') )
.catch(error => console.log(error));

//import router
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');

//app middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
//app.use(cors());
app.use(cors({ origin: process.env.CLIENT_URL }));



//middlewares
app.use('/api',authRouter);
app.use('/api',userRouter);


const port = process.env.PORT;
app.listen(port, ()=> console.log(`server listening on ${port} port`));
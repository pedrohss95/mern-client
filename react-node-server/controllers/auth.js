const User = require('../models/user') 
const AWS = require('aws-sdk');
const { body } = require('express-validator');
const jwt = require('jsonwebtoken');
const { registerEmailParams } = require('../helpers/email')

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAcessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION

})

const ses = new AWS.SES({
    apiVersion: '2010-12-01'
});

exports.register = (req, res) => {
    //console.log('REGISTER CONTROLLER',req.body);
    
    const {name, email, password} = req.body;

    //check if user already exists
    User.findOne({email}).exec((err,user) => {
        if (user){
            console.log(err);
            return res.status(400).json({
                error: "User already exists"
            })
        }
        // generate token with user name email and password
        const token = jwt.sign({name, email, password}, process.env.JWT_ACCOUNT_ACTIVATION,{
            expiresIn: '10m'
        })
        //sending email
        const params = registerEmailParams(name, email, token);
    
        const sendEmailOnRegister = ses.sendEmail(params).promise()
    
        sendEmailOnRegister
            .then(data => {
                console.log("Email sent from SES", data);
                res.json({
                    message: `Email has been succesfully sent to ${email}, please follow the instructions to complete your registration.`
                })
            })
            .catch( error => {
                console.log("ses email failed on register",error);
                res.status(422).json({
                    error: `We couldn't verify your email: ${email}, please try again.`
                })
            })
    });

    
}
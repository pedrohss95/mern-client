const User = require('../models/user')
const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const {
    registerEmailParams,
    forgotPasswordEmailParams
} = require('../helpers/email');
const shortId = require('shortid');
const {
    json
} = require('body-parser');
const _ = require('loadsh');

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

    const {
        name,
        email,
        password
    } = req.body;

    //check if user already exists
    User.findOne({
        email
    }).exec((err, user) => {
        if (user) {
            console.log(err);
            return res.status(400).json({
                error: "User already exists"
            })
        }
        // generate token with user name email and password
        const token = jwt.sign({
            name,
            email,
            password
        }, process.env.JWT_ACCOUNT_ACTIVATION, {
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
            .catch(error => {
                console.log("ses email failed on register", error);
                res.status(422).json({
                    error: `We couldn't verify your email: ${email}, please try again.`
                })
            })
    });

}

exports.authenticate = (req, res) => {
    const {
        token
    } = req.body;

    // console.log(token)

    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function (err, decoded) {
        if (err) {
            return res.status(401).json({
                error: "Expired link. Please do the register and try again."
            });
        }

        const {
            name,
            password,
            email
        } = jwt.decode(token)
        const username = shortId.generate()

        User.findOne({
            email
        }).exec((err, user) => {
            if (user) {
                return res.status(400).json({
                    error: "Email is taken"
                });
            }
            // register new user

            const newUser = new User({
                username,
                name,
                password,
                email
            })
            newUser.save((err, result) => {
                //console.log("error saving in db ===>",err);
                if (err) {
                    return res.status(401).json({
                        error: "An error was occurred, please try again."

                    });
                }
                return res.json({
                    message: "Registration completed. Thank you!\n Click here to login."

                });
            });
        });
    });
};

exports.login = (req, res) => {
    const {
        email,
        password
    } = req.body;
    // console.table({
    //     email,
    //     password
    // })

    User.findOne({
        email
    }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User not found. Please register first and try again."
            });
        }

        // authenticate user
        if (!user.authenticate(password)) {
            return res.status(400).json({
                error: "Password is not correct, please try again."

            });
        }

        const token = jwt.sign({
            _id: user._id
        }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        })

        const {
            _id,
            name,
            email,
            role
        } = user

        return res.json({
            token,
            user: {
                _id,
                name,
                email,
                role
            }
        });
    });
};


exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256']
});

exports.authMiddleware = (req, res, next) => {
    const authUserId = req.user._id
    User.findOne({
        _id: authUserId
    }).exec((err, user) => {
        if (err || !user) {
            res.status(400).json({
                error: "User not found"
            })
        }
        req.profile = user;
        next()
    })
};

exports.adminMiddleware = (req, res, next) => {
    const adminUserId = req.user._id
    User.findOne({
        _id: adminUserId
    }).exec((err, user) => {
        if (err || !user) {
            res.status(400).json({
                error: "User not found"
            })
        }
        if (user.role !== 'admin') {
            res.status(400).json({
                error: "Access denied. Page for admins only"
            })
        }
        req.profile = user;
        next();
    });
};

exports.forgotPassword = (req, res) => {
    const {
        email
    } = req.body;
    // checks if exists user with email
    User.findOne({
        email
    }).exec((err, user) => {
        if (err || !user) {
            res.status(400).json({
                error: "User with this email does not exists."
            })
        } // generate token
        const token = jwt.sign({
            name: user.name
        }, process.env.JWT_RESET_PASSWORD, {
            expiresIn: '10m'
        })
        //send email
        const params = forgotPasswordEmailParams(email, token);

        //populate forgotPasswordLink field 

        return user.updateOne({
            resetPasswordLink: token
        }, (err, success) => {
            if (err) {
                res.status(400).json({
                    error: "Password reset failed. Try later"
                })
            }
            const sendEmail = ses.sendEmail(params).promise()
            sendEmail
                .then(data => {
                    console.log("Email reset link sent from SES", data);
                    res.json({
                        message: `Reset Password Email link has been succesfully sent to ${email}, please follow the instructions to reset your password.`
                    })
                }).catch(error => {
                    console.log('SES email failed reseting password', error)
                    res.status(422).json({
                        error: "We couldn't reset your password"
                    })
                })
        })
    })
}

exports.resetPassword = (req, res) => {
    const {
        resetPasswordLink,
        newPassword
    } = req.body;
    if (resetPasswordLink) {
        // check for expiry
        jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, (err, success) => {
            if (err) {
                res.status(400).json({
                    error: "Reset Password Link has expired. Please try again"
                });
            }

            User.findOne({
                resetPasswordLink
            }).exec((err, user) => {
                if (err || !user) {
                    res.status(400).json({
                        error: "Invalid token. Please try again"
                    });
                }

                const updateFields = {
                    password: newPassword,
                    resetPasswordLink: ''
                }

                user = _.extend(user, updateFields)

                user.save((err, result) => {
                    if (err) {
                        res.status(400).json({
                            error: "Password reset failed.Try again"
                        });
                    }
                    res.json({
                        message: "Password reset successfull. Please login"
                    })
                })

            });

        });

    }

}
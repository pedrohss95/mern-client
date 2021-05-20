exports.registerEmailParams = (name, email, token) => {
    return {
        Source: process.env.EMAIL_FROM,
        /* required */
        Destination: {
            /* required */
            ToAddresses: [email],
        },
        ReplyToAddresses: [process.env.EMAIL_FROM],
        Message: {
            /* required */
            Body: {
                /* required */
                Html: {
                    Charset: "UTF-8",
                    Data: `<Html><body>
                                <h1>Hello ${name}, Verification email</h1>
                                <p>Please use the following link to complete your registration:</p>
                                <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
                            </body></Html>`
                },
            },
            Subject: {
                Charset: 'UTF-8',
                Data: 'Registration email'
            }
        }
    }
};

exports.forgotPasswordEmailParams = (email, token) => {
    return {
        Source: process.env.EMAIL_FROM,
        /* required */
        Destination: {
            /* required */
            ToAddresses: [email],
        },
        ReplyToAddresses: [process.env.EMAIL_FROM],
        Message: {
            /* required */
            Body: {
                /* required */
                Html: {
                    Charset: "UTF-8",
                    Data: `<Html>
                                <h1>RESET PASSWORD LINK</h1>
                                <p>Please use the following link to reset your password:</p>
                                <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
                           </Html>`
                },
            },
            Subject: {
                Charset: 'UTF-8',
                Data: 'Reset Password Link'
            }
        }
    }
};
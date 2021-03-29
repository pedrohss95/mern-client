exports.registerEmailParams = (name, email, token) => {
    return {
        Source: process.env.EMAIL_FROM,
        /* required */
        Destination: {
            /* required */
            ToAddresses: [email],
        },
        ReplyToAddresses: [process.env.EMAIL_TO],
        Message: {
            /* required */
            Body: {
                /* required */
                Html: {
                    Charset: "UTF-8",
                    Data: `<Html><body>
         <h1>Hello ${name}, please verify your email address</h1>
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
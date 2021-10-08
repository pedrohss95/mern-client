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

exports.linkPublishedParams = (email, data) => {
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
                                <h1>New Link Published | reactnodeaws.com</h1>
                                <p>New Link Titled: <b>${data.title}</b> has been published for the following categories:</p>

                                ${data.categories.map(category => {
                                    return `
                                    <div>
                                      <h2>${category.name}</h2>
                                      <img src="${category.image.url}" alt="${category.name}" style="height:50px;" />
                                      <h3> <a href="${process.env.CLIENT_URL}/links/${category.slug}">Check it out"</a></h3>
                                    </div>
                                    `
                                    
                                }).join("-------------------------------------")}
                                <br />
                                <p>Do you not wish to receive those notifications? </p>
                                <p>Turn off notifications going to your <b>Dashboard</b> > <b>Update Profile</b> > <b>Uncheck Categories</b></p>
                                <p>${process.env.CLIENT_URL}/user/profile/update</p>
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
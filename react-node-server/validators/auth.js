const { check, validationResult } = require('express-validator');

exports.userRegisterValidator = [
    check('name')
        .notEmpty()
        .isLength({ max: 32})
        .withMessage('Name Required'),
    check('email')
        .notEmpty()
        .isEmail()
        .withMessage('Must be a valid email'),
    check('password')
        .notEmpty()
        .isLength({ min: 6})
        .withMessage('Password with minimium of 6 characters required'),
              

]
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
        .isLength({ min: 8})
        .withMessage('Password with minimium of 8 characters required'),
              

];

exports.userLoginValidator = [
    check('email')
        .notEmpty()
        .isEmail()
        .withMessage('Must be a valid email'),
    check('password')
        .notEmpty()
        .isLength({ min: 8})
        .withMessage('Password with minimium of 8 characters required'),
              

];

exports.forgotPasswordValidator = [
    check('email')
        .notEmpty()
        .isEmail()
        .withMessage('Must be a valid email')              

];

exports.resetPasswordValidator = [
    check('newPassword')
    .notEmpty()
    .isLength({ min: 8})
    .withMessage('Password with minimium of 8 characters required'),
    check('resetPasswordLink')
        .notEmpty()
        .withMessage('Token is required')
];
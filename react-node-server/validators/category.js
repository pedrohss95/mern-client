const { check, validationResult } = require('express-validator');

exports.categoryCreatorValidator = [
    check('name')
        .notEmpty()
        .isLength({ max: 32})
        .withMessage('Name Required'),
    check('image')
        .notEmpty()
        .withMessage('Image is required'),
    check('content')
        .notEmpty()
        .isLength({ min: 20})
        .withMessage('Content is required'),
];

exports.categoryUpdateValidator = [
    check('name')
        .notEmpty()
        .isLength({ max: 32})
        .withMessage('Name Required'),
    check('content')
        .notEmpty()
        .isLength({ min: 20})
        .withMessage('Content is required'),
];
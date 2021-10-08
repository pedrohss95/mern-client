const { check, validationResult } = require('express-validator');

exports.linkCreatorValidator = [
    check('title')
        .notEmpty()
        .isLength({ max: 256})
        .withMessage('Title Required'),
    check('url')
        .notEmpty()
        .isLength({ max: 256})
        .withMessage('Url is required'),
    check('slug')
        .isLength({ max: 256})
        .withMessage('Slug is required'),
    check('categories')
        .notEmpty()
        .withMessage('Please specify a category'),
    check('type')
        .notEmpty()
        .withMessage('Please specify the type: Free or Paid'),
    check('medium')
        .notEmpty()
        .withMessage('Please specify the type of the media: Book or video'),
];

exports.linkUpdateValidator = [
    check('title')
        .notEmpty()
        .isLength({ max: 256})
        .withMessage('Title Required'),
    check('url')
        .notEmpty()
        .isLength({ max: 256})
        .withMessage('Url is required'),
    check('slug')
        .isLength({ max: 256})
        .withMessage('Slug is required'),
    check('categories')
        .notEmpty()
        .withMessage('Please specify a category'),
    check('type')
        .notEmpty()
        .withMessage('Please specify the type: Free or Paid'),
    check('medium')
        .notEmpty()
        .withMessage('Please specify the type of the media: Book or video'),
];
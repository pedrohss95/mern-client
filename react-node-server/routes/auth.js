const express = require('express')

const router = express.Router()

// import validators
const { userRegisterValidator, userLoginValidator } = require('../validators/auth');
const { runValidation } = require('../validators');

//import from controllers
const {register, authenticate, login} = require('../controllers/auth');

router.post('/register', userRegisterValidator, runValidation, register);
router.post('/activate', authenticate);
router.post('/login', userLoginValidator, runValidation, login);

module.exports = router;
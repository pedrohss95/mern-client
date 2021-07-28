const express = require('express');
const router = express.Router();

// importing validators
const {
  linkCreatorValidator,
  linkUpdateValidator
} = require('../validators/link');

const {
  runValidation
} = require('../validators');

// import controllers

const {
  requireSignin,
  authMiddleware,
  adminMiddleware
} = require('../controllers/auth');
const { create, list, read, update,remove,clickCounter } = require('../controllers/link');

//routes

router.post('/link', linkCreatorValidator, runValidation, requireSignin, authMiddleware, create);
router.get('/link/all', list);
router.put('/click-counter', clickCounter);
router.get('/link/:slug', read);
router.put('/link/:slug', linkUpdateValidator, runValidation, requireSignin, authMiddleware, update);
router.delete('/link/:slug', requireSignin, adminMiddleware, remove);


module.exports = router;


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
  adminMiddleware,
  canUpdateAndDeleteLink
} = require('../controllers/auth');
const { create, list, read, update,remove,clickCounter,popular,popularInCategory } = require('../controllers/link');

//routes

router.post('/link', linkCreatorValidator, runValidation, requireSignin, authMiddleware, create);
router.post('/link/all', requireSignin, adminMiddleware, list);
router.put('/click-counter', clickCounter);
router.get('/link/popular', popular);
router.get('/link/popular/:slug', popularInCategory);
router.get('/link/:id', read);
router.put('/link/:id', linkUpdateValidator, runValidation, requireSignin, authMiddleware, canUpdateAndDeleteLink, update);
router.put('/link/admin/:id', linkUpdateValidator, runValidation, requireSignin, adminMiddleware, update);
router.delete('/link/:id', requireSignin, authMiddleware, canUpdateAndDeleteLink, remove);
router.delete('/link/admin/:id', requireSignin, adminMiddleware, remove);


module.exports = router;


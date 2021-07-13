const express = require('express');
const router = express.Router();

// importing validators
const {
  categoryCreatorValidator,
  categoryUpdateValidator
} = require('../validators/category');

const {
  runValidation
} = require('../validators');

// import controllers

const {
  requireSignin,
  authMiddleware,
  adminMiddleware
} = require('../controllers/auth');
const { create, list, read, update,remove } = require('../controllers/category');

//routes

router.post('/category', categoryCreatorValidator, runValidation, requireSignin, adminMiddleware, create);
router.get('/categories', list);
router.get('/category/:slug', read);
router.put('/category/:slug', categoryUpdateValidator, runValidation, requireSignin, adminMiddleware, update);
router.delete('/category/:slug', requireSignin, adminMiddleware, remove);


module.exports = router;


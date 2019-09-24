const express = require('express');
const router = express.Router();

const checkAuth = require('../middleeware/check-auth');
const userController = require('../controllers/user');

router.post('/signup', userController.user_signup);

router.post('/login', userController.user_login);

router.delete('/:userId', checkAuth, userController.user_delete);


module.exports = router;
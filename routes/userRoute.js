const express = require('express');

const path = require('path');

const userController = require('../controllers/user')

const router = express.Router();

router.post('/signup', userController.postAddUser)

router.post('/login',userController.postLogin)

module.exports = router
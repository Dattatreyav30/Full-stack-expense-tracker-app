const express = require('express');

const path = require('path');

const userController = require('../controllers/user')

const router = express.Router();

router.post('/signup', userController.postAddUser)

module.exports = router
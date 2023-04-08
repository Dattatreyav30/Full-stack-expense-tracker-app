const express = require('express');

const path = require('path');

const router = express.Router();

const passwordController = require('../controllers/passwordController')

router.post('/resetPassword',passwordController.passWord);


module.exports = router
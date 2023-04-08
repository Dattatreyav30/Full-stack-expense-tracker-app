const express = require('express');

const path = require('path');

const router = express.Router();

const passwordController = require('../controllers/passwordController');


router.post('/forgotPassword', passwordController.passWord);

router.get('/resetPassword/:id',passwordController.resetPassword);

router.post('/updatePassword/:id',passwordController.updatePassword)


module.exports = router
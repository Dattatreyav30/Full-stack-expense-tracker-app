const express = require('express');

const path = require('path');

const router = express.Router();

const userAuthentication = require('../middlewares/auth')

const orderController = require('../controllers/orderController')

router.get('/premiumMembership', userAuthentication.authentication, orderController.premiumMembership);

router.post('/updateTransactionstatus', userAuthentication.authentication, orderController.updateTrnsactionstatus);

router.post('/transactionfailed',userAuthentication.authentication,orderController.transactionfailed)

module.exports = router;
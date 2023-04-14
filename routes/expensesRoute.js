const express = require('express');

const path = require('path');

const expenseController = require('../controllers/expenseController');

const userAuthentication = require('../middlewares/auth')

const router = express.Router();

router.post('/add-expense',userAuthentication.authentication ,expenseController.addExpense);

router.get('/get-all-expenses', userAuthentication.authentication, expenseController.getAllExpenses);

router.delete('/delete-expense/:id',userAuthentication.authentication, expenseController.deleteExpense)

module.exports = router;
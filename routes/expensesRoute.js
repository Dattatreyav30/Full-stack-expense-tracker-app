const express = require('express');

const path = require('path');

const expenseController = require('../controllers/expenseController')

const router = express.Router();

router.post('/add-expense', expenseController.addExpense);

router.get('/get-all-expenses',expenseController.getAllExpenses);

router.delete('/delete-expense/:id',expenseController.deleteExpense)

module.exports = router;
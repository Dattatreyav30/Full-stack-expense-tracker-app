const { where } = require('sequelize');

const Expense = require('../models/expenseModel');

const bcrypt = require('bcrypt');

exports.addExpense = async (req, res, next) => {
    try {
        const expenseAmount = req.body.expenseAmount;
        const expenseDescription = req.body.expenseDescription;
        const expenseCategory = req.body.expenseCategory;
        Expense.create({
            expenseAmount: expenseAmount,
            expenseDescription: expenseDescription,
            expenseCategory: expenseCategory
        })
        res.status(200).json({ message: 'table created succesfully' })
    } catch (err) {
        res.status(400).json({ message: 'something went wrong' })
    }
}


exports.getAllExpenses = async (req, res, next) => {
    try {
        const allExpenses = await Expense.findAll()
        res.json(allExpenses);
    } catch (err) {
        res.json(403).json({ message: ' cant get all the expenses at the moment' })
    }
}

exports.deleteExpense = async (req, res, next) => {
    try {
        const id = req.params.id;
        const expense = await Expense.findOne({
            where: {
                id: id
            }
        })
        console.log(expense)
        await expense.destroy();
        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (err) {
        res.status(404).json({ message: 'cant delete the expense at the moment' })
    }
}
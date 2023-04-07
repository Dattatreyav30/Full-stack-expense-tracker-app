const { where } = require('sequelize');

const Expense = require('../models/expenseModel');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const sequelize = require('../util/database');


exports.addExpense = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const token = req.header('authorization');
        const userId = jwt.verify(token, '9efc07b82d60a3c38b724cb509e20f100ae3defd34431b2ccc42f28301e5504f')
        const expenseAmount = req.body.expenseAmount;
        const expenseDescription = req.body.expenseDescription;
        const expenseCategory = req.body.expenseCategory;

        const user = await User.findOne({ where: { id: userId.userId }, transaction: t })
        const Userexpenses = user.totalexpenses || 0;
        const totalexpenses = parseInt(Userexpenses) + parseInt(expenseAmount);

        await User.update({ totalexpenses: totalexpenses }, { where: { id: userId.userId }, transaction: t })
        await Expense.create({
            expenseAmount: expenseAmount,
            expenseDescription: expenseDescription,
            expenseCategory: expenseCategory,
            userId: userId.userId
        }, { transaction: t })
        await t.commit();
        res.status(200).json({ message: 'table created succesfully' })
    } catch (err) {
        await t.rollback();
        console.log(err)
        res.status(400).json({ message: 'something went wrong' })
    }
}


exports.getAllExpenses = async (req, res, next) => {
    try {
        const allExpenses = await Expense.findAll({ where: { userId: req.user.id } })
        res.json(allExpenses);
    } catch (err) {
        res.json(403).json({ message: ' cant get all the expenses at the moment' })
    }
}

exports.deleteExpense = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const token = req.header('authorization');
        console.log(token);
        const userId = jwt.verify(token, '9efc07b82d60a3c38b724cb509e20f100ae3defd34431b2ccc42f28301e5504f')
        const id = req.params.id;

        const user = await User.findOne({ where: { id: userId.userId }, transaction: t });
        const userExpenses = user.totalexpenses
        const expense = await Expense.findOne({
            where: {
                id: id,
                userId: userId.userId
            }
        }, { transaction: t })
        const expenseAmount = expense.expenseAmount;
        const totalexpenses = parseInt(userExpenses - expenseAmount)
        User.update({ totalexpenses: totalexpenses }, { where: { id: userId.userId } })
        await expense.destroy();
        await t.commit()
        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (err) {
        await t.rollback()
        res.status(404).json({ message: 'cant delete the expense at the moment' })
    }
}
const { where } = require('sequelize');

const Expense = require('../models/expenseModel');

const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const sequelize = require('../util/database');


exports.addExpense = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const expenseAmount = req.body.expenseAmount;
        const expenseDescription = req.body.expenseDescription;
        const expenseCategory = req.body.expenseCategory;

        const user = await User.findOne({ where: { id: req.user.id }, transaction: t })
        const Userexpenses = user.totalexpenses || 0;
        const totalexpenses = parseInt(Userexpenses) + parseInt(expenseAmount);

        await User.update({ totalexpenses: totalexpenses }, { where: { id: req.user.id }, transaction: t })
        await Expense.create({
            expenseAmount: expenseAmount,
            expenseDescription: expenseDescription,
            expenseCategory: expenseCategory,
            userId: req.user.id
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
        const page = +req.query.page || 1
        const limit = +req.query.limit;
        const total_items = await Expense.count({ where: { userId: req.user.id } })
        const allExpenses = await Expense.findAll({
            where: { userId: req.user.id }, offset: (page - 1) * limit,
            limit: limit
        })
        const pagination = {
            currentPage: page,
            hasNextPage: limit * page < total_items,
            nextPage: page + 1,
            hasPreviousPage: page > 1,
            previousPage: page - 1,
            lastPage: Math.ceil(total_items / limit),
        }
        res.status(200).json({ allExpenses, pagination, success: true })
    } catch (err) {
        res.json(403).json({ message: ' cant get all the expenses at the moment' })
    }
}

exports.deleteExpense = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const id = req.params.id;
        const user = await User.findOne({ where: { id: req.user.id }, transaction: t });
        const userExpenses = user.totalexpenses
        const expense = await Expense.findOne({
            where: {
                id: id,
                userId: req.user.id
            }
        }, { transaction: t })
        const expenseAmount = expense.expenseAmount;
        const totalexpenses = parseInt(userExpenses - expenseAmount)
        await User.update({ totalexpenses: totalexpenses }, { where: { id: req.user.id } })
        await expense.destroy();
        await t.commit()
        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (err) {
        console.log(err)
        await t.rollback()
        res.status(404).json({ message: 'cant delete the expense at the moment' })
    }
}
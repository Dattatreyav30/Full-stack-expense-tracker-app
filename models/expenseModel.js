const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Expense = sequelize.define('expense', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    expenseAmount: {
        type: Sequelize.STRING,
        allowNull: false
    },
    expenseDescription: {
        type: Sequelize.STRING,
        allowNull: false
    },
    expenseCategory: {
        type: Sequelize.STRING,
        allowNull: false
    },
})

module.exports = Expense;
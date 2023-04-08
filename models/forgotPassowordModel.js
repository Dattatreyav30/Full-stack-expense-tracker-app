const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const ForgotPassword = sequelize.define('forgotpasswordRequests', {
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    isActive: {
        type: Sequelize.BOOLEAN,
    }
})

module.exports = ForgotPassword;
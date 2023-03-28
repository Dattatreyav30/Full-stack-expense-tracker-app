const { where } = require('sequelize');
const User = require('../models/userModel');

exports.postAddUser = (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    User.create({
        username: username,
        email: email,
        password: password
    }).then((result) => {
        res.status(200).json({ success: 'user signed up successfully' })
    }).catch((err) => {
        res.status(500).json({ success: 'unable to sign up at the moment' })
    })
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({
        where: {
            email: email,
        }
    }).then((user) => {
        if (!user) {
            res.status(401).json({ result: 'Incorrect email or password' })
        }
        else if (user.password != password) {
            res.status(400).json({ result: 'Incorrect password' })
        }
        else {
            res.status(200).json({ result: 'user logged in successfully' })
        }
    })
        .catch((err) => {
            res.status(400).json({ result: 'not found' })
        })
}
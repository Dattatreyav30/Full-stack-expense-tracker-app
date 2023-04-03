const { where } = require('sequelize');
const User = require('../models/userModel');

const bcrypt = require('bcrypt');

exports.postAddUser = async (req, res, next) => {
    try {
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        const user = await User.findOne({
            where: {
                email: email
            }
        })
        if (user) {
            return res.status(200).json({ success: 'user already exists' });
        }
        bcrypt.hash(password, 10, async (err, hash) => {
            await User.create({
                username: username,
                email: email,
                password: hash,
            })
            res.status(200).json({ success: 'user signed up successfully' })
        })
    } catch (err) {
        res.status(500).json({ success: 'unable to sign up at the moment' })
    }
}

exports.postLogin = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await User.findOne({
            where: {
                email: email,
            }
        })
        if (!user) {
            res.status(404).json({ result: 'user not found' })
        }
        const match = await bcrypt.compare(password, user.password);

        if (match) {
            res.status(200).json({ result: 'user logged in successfully' })
        }
        else {
            res.status(401).json({ result: 'Incorrect password' })
        }
    } catch (err) {
        res.status(403).json({ result: 'cannot login at the moment' })
    }

}
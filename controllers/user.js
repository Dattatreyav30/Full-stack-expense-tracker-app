const { where } = require('sequelize');
const User = require('../models/userModel');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const sequelize = require('../util/database');


const crypto = require('crypto');
const secretKey = crypto.randomBytes(32).toString('hex');
//console.log(secretKey);


function generateAccessToken(id) {
    return jwt.sign({ userId: id }, "9efc07b82d60a3c38b724cb509e20f100ae3defd34431b2ccc42f28301e5504f")
}

exports.postAddUser = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        const user = await User.findOne({
            where: {
                email: email
            }, transaction: t
        })
        if (user) {
            throw new Error();
        }
        bcrypt.hash(password, 10, async (err, hash) => {
            await User.create({
                username: username,
                email: email,
                password: hash,
                totalexpenses: 0
            })
            await t.commit();
            res.status(200).json({ success: 'user signed up successfully' })
        })
    } catch (err) {
        await t.rollback();
        res.status(500).json({ success: 'user already exists' })
    }
}

exports.postLogin = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await User.findOne({
            where: {
                email: email,
            }, transaction: t
        })
        if (!user) {
            throw new Error()
        }
        const match = await bcrypt.compare(password, user.password);

        if (match) {
            res.status(200).json({ result: 'user logged in successfully', token: generateAccessToken(user.id) })
            await t.commit();
        }
        else {
            res.status(401).json({ result: 'Incorrect password' })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ result: 'user not found' })
        await t.rollback()
    }

}
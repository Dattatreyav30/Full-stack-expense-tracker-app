const { where } = require('sequelize');
const User = require('../models/userModel');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const crypto = require('crypto');
const secretKey = crypto.randomBytes(32).toString('hex');
//console.log(secretKey);


function generateAccessToken(id) {
    return jwt.sign({ userId: id },  "9efc07b82d60a3c38b724cb509e20f100ae3defd34431b2ccc42f28301e5504f")
}

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
                totalexpenses:0
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
            return res.status(404).json({ result: 'user not found' })
        }
        const match = await bcrypt.compare(password, user.password);

        if (match) {
            res.status(200).json({ result: 'user logged in successfully',token: generateAccessToken(user.id) })
        }
        else {
            res.status(401).json({ result: 'Incorrect password' })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ result: 'cannot login at the moment' })
    }

}
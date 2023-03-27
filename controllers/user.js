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
        res.status(200).json({ success: true })
    }).catch((err) => {
        res.status(500).json({ success: true })
    })
}
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');

const authentication = async (req, res, next) => {
    try {
        const token = req.header('authorization');
        //console.log(token);
        const userId = jwt.verify(token, '9efc07b82d60a3c38b724cb509e20f100ae3defd34431b2ccc42f28301e5504f');
        const user = await User.findByPk(userId.userId);
        req.user = user;
        next();

    } catch (err) {
        return res.status(401).json({ success: false })
    }
}

// const addUserId = (req, res, next) => {
//     try {
//         const token = req.header('authorization');
//         console.log(token);
//         const userId = jwt.verify(token, '9efc07b82d60a3c38b724cb509e20f100ae3defd34431b2ccc42f28301e5504f')
//         req.user.id = userId.userId;
//         next();
//     } catch (err) {
//         return res.status(401).json({ success: false })
//     }
// }

module.exports = {
    authentication,
};
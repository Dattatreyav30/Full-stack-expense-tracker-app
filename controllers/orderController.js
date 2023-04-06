const { where, json } = require('sequelize');

const env = require('dotenv').config();

const Razorpay = require('razorpay');
const Order = require('../models/orderModel');

exports.premiumMembership = async (req, res, next) => {
    try {
        const rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET_KEY,
        });
        const amount = 2500;
        const order = await rzp.orders.create({ amount, currency: 'INR' });
        await req.user.createOrder({ orderId: order.id, status: 'PENDING', userId: req.user.id });
        res.status(201).json({ order, key_id: rzp.key_id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'something went wrong' });
    }
};


exports.updateTrnsactionstatus = async (req, res, next) => {
    try {
        const payementId = req.body.payment_id;
        const orderId = req.body.order_id;
        const order = await Order.findOne({ where: { orderId: orderId } });
        await order.update({ paymentId: payementId, status: 'SUCCESSFULL' })
        await req.user.update({ isPremiumUser: true });
        res.status(200).json({ success: true, message: 'transaction successfull' })
    } catch (err) {
        res.status(401).json({ message: 'something went wrong' })
    }
}

exports.transactionfailed = async (req, res, next) => {
    try {
        const payementId = req.body.payment_id;
        console.log(payementId)
        const orderId = req.body.order_id;
        const order = await Order.findOne({ where: { orderId: orderId } });
        await order.update({ paymentId: payementId, status: 'FAILED' })
        await req.user.update({ isPremiumUser: false });
        res.status(200).json({ success: true, message: 'transaction failed' })
    } catch (err) {
        res.status(401).json({ message: 'something went wrong' })
    }
}
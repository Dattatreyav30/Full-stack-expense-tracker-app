const sib = require('sib-api-v3-sdk');

require('dotenv').config();

const transEmailApi = new sib.TransactionalEmailsApi();

const forgotModel = require('../models/forgotPassowordModel');
const User = require('../models/userModel');

const { v4: uuidv4 } = require('uuid');

const bcrypt = require('bcrypt');



exports.passWord = async (req, res, next) => {
    try {
        const email = req.body.email;

        const client = sib.ApiClient.instance
        const apiKey = client.authentications['api-key'];
        apiKey.apiKey = process.env.API_KEY;

        const user = await User.findOne({ where: { email: email } })
        const userEmail = user.email;
        const userId = user.id;
        const id = uuidv4()
        await forgotModel.create({
            id: id,
            userId: userId,
            isActive: true
        })
        const sender = {
            email: 'dattatreyadattu25@gmail.com'
        }

        const recivers = [
            {
                email: userEmail
            },
        ]

        await transEmailApi.sendTransacEmail({
            sender,
            to: recivers,
            subject: 'reset password link',
            htmlContent: `http://localhost:3000/password/resetPassword/${id}`
        })
        res.status(200).json({ message: 'password reset link sent succesfully' })
    } catch (err) {
        res.status(500).json({ message: 'server error' })
    }

}

exports.resetPassword = async (req, res, next) => {
    try {
        const id = req.params.id;
        const password = await forgotModel.findOne({ where: { id: id, isActive: true } })
        const userId = password.userId
        const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet"
                integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
            <script defer src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"
                integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4"
                crossorigin="anonymous"></script>
            <title>password reset</title>
        </head>
        
        <body>
            <div class="container col-6 offset-3">
                <form action="" method="post">
                    <label for="newPassword" class="form-label"><b>Enter your new password</b></label>
                    <input type="text" name="newPassword" id="newPassword" class="form-control">
                    <button class="btn btn-primary mt-2 w-100">Submit</button>
                </form>
            </div>
        </body>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.3.4/axios.min.js"></script>
        <script>
            const form = document.querySelector('form');
        
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const obj = {
                    password: document.getElementById('newPassword').value,
                    userId:${userId},
                }
               const response = await axios.post('http://localhost:3000/password/updatePassword/${id}', obj)
               alert('password resetted succesfully');
               location.href = 'http://127.0.0.1:5500/views/login.html'
            })
        </script>`;
        res.status(200).send(htmlContent);

    } catch (err) {
        res.status(404).json('invalid link/link is expired')
    }
}

exports.updatePassword = async (req, res, next) => {
    try {
        const id = req.params.id
        const password = req.body.password;
        const forgotUserId = await forgotModel.findOne({ where: { id: id } })
        const userId = forgotUserId.userId
        bcrypt.hash(password, 10, async (err, hash) => {
            await User.update({ password: hash }, { where: { id: userId } })
            res.status(200).json({ success: 'password updated'})
        })
        await forgotUserId.update({ isActive: false })
    } catch (err) {
        res.sttaus(404).json({ message: 'server error' })
    }
}
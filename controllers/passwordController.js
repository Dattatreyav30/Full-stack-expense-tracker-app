const sib = require('sib-api-v3-sdk');

require('dotenv').config();

const transEmailApi = new sib.TransactionalEmailsApi();




exports.passWord = async (req, res, next) => {
    const email = req.body.email;
    console.log(email)
    const client = sib.ApiClient.instance

    const apiKey = client.authentications['api-key'];

    apiKey.apiKey = process.env.API_KEY;

    console.log(apiKey.apiKey)
    const sender = {
        email: 'dattatreyadattu25@gmail.com'
    }

    const recivers = [
        {
            email: email
        },
    ]

    transEmailApi.sendTransacEmail({
        sender,
        to: recivers,
        subject: 'reset password link',
        textContent: 'you reset password link'
    })
        .then((result) => {
            console.log(result)
        }).catch((err) => {
            console.log(err)
        })
}


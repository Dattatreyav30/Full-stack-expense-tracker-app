const express = require('express');

const bodyParser = require('body-parser');

const cors = require('cors');

const sequelize = require('./util/database');

const userRoute = require('./routes/userRoute');
const expenseRoute = require('./routes/expensesRoute');
const orderRoute = require('./routes/orders');
const passwordRoute = require('./routes/passwordRoute')

const app = express();

const User = require('./models/userModel');
const Expense = require('./models/expenseModel');
const Orders = require('./models/orderModel');
const forgotPassword  = require('./models/forgotPassowordModel')

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(cors());


app.use('/user', userRoute);
app.use('/expenses',expenseRoute);
app.use('/purchase',orderRoute);
app.use('/password',passwordRoute);


User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Orders);
Orders.belongsTo(User)

User.hasMany(forgotPassword)
forgotPassword.belongsTo(User)

sequelize.sync()
    .then((result) => {
        // console.log(result);
    }).catch((err) => {
        console.error(err);
    })

app.listen(3000);
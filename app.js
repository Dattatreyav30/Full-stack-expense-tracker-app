const express = require('express');

const bodyParser = require('body-parser');

const cors = require('cors');

const sequelize = require('./util/database');

const userRoute = require('./routes/userRoute');

const expenseRoute = require('./routes/expensesRoute')

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(cors());


app.use('/user', userRoute);

app.use('/expenses',expenseRoute)

sequelize.sync()
    .then((result) => {
        // console.log(result);
    }).catch((err) => {
        console.error(err);
    })

app.listen(3000);
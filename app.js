const express = require('express');

const bodyParser = require('body-parser');

const cors = require('cors');

const sequelize = require('./util/database');

const userRoute = require('./routes/userRoute')

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(cors());


app.use('/user', userRoute)

sequelize.sync()
    .then((result) => {
        // console.log(result);
    }).catch((err) => {
        console.error(err);
    })

app.listen(3000);
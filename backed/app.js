const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const users = require('./routes/api/users');

const port = process.env.PORT || 4000;

require('./config/passport')(passport);

const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-type,Accept,X-Access-Token,X-Key, Authorization');
    res.header('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

const db = require('./config/keys').mongoURI;

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() =>
        console.log('MongoDB successfully connected.')
    ).catch(err => console.log(err));

app.use(passport.initialize());

app.use('/users', users);

app.listen(port, () => console.log(`Server up and running on port ${port} !`));
'use strict';

// const path = require('path');
// const passport = require('passport');
// const {router: usersRouter} = require('./users');
// const {router: playlistRouter} = require('./playlists');
// const {router: authRouter, localStrategy, jwtStrategy} = require('./auth');

const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { MongoClient } = require("mongodb");

const app = express();
const {DATABASE_URL, PORT} = require('./config');

// mongoose.Promise = global.Promise;
// app.set('view engine', 'html');
// app.set('views', path.join(__dirname, 'views'));
// app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.raw({extended: false}));
app.use(bodyParser.urlencoded({extended: false}));

app.use(morgan('common'));

// app.use(authRouter);
// app.use(usersRouter);
// app.use(playlistRouter);

// passport.use(localStrategy);
// passport.use(jwtStrategy);

app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

let server;

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(DATABASE_URL);

    const kittySchema = new mongoose.Schema({
        name: String
    });

    kittySchema.methods.speak = function speak() {
        const greeting = this.name
        ? "Meow name is " + this.name
        : "I don't have a name";
        console.log(greeting);
    };

    const Kitten = mongoose.model('Kitten', kittySchema);

    const silence = new Kitten({ name: 'Silence' });
    console.log(silence.name); // 'Silence'

    const fluffy = new Kitten({ name: 'fluffy' });
    await fluffy.save();
    fluffy.speak(); // "Meow name is fluffy"

    server = app.listen(PORT, () => {
        console.log(`Your app is listening on port ${PORT}`);
    })
}
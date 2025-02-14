const express = require('express');
const mongoose = require("mongoose");
const router = require('./routes/url.routes');
const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv')
dotenv.config()

const app = express();
app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT} PORT`);
});

// MongoDB URL
const url = "mongodb://127.0.0.1:27017/bitly";
// Connect MongoDB
mongoose.connect(url)


// middleware for json & urlincoding
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//template engines
// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Middleware for session
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        secure: false,
        httpOnly: true
    }
}));

app.use('/', router);
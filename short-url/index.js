const express = require('express');
const { connectToMongoDB } = require('./database/db');
const urlRoute = require('./routes/url.route');
const app = express();
const PORT = 8001;

// Middleware for parsing
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to MongoDB
connectToMongoDB('mongodb://127.0.0.1:27017/short-url');

// Setup EJS
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Serve Static Files (optional, if needed)
app.use(express.static('public'));

// URL Shortener Route
app.use('/', urlRoute);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

const express = require('express');
const ejs = require('ejs');
const { connectToMongoDB } = require('./database/db');
const urlRoute = require('./routes/url.route');
const URL = require('./models/url.model');
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

// Route to Render homepage.ejs
app.get('/', (req, res) => {
    res.render('homepage'); // Renders views/homepage.ejs
});

// URL Shortener Route
app.use('/url', urlRoute);

app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        { shortId },
        { 
            $push: {
                visitHistory: { timestamp: Date.now() }
            } 
        }
    );

    if (entry) {
        res.redirect(entry.redirectURL);
    } else {
        res.status(404).send('URL Not Found');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

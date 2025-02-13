const express = require('express');
const {connectToMongoDB} = require('./database/db');
const urlRoute = require('./routes/url.route');
const URL = require('./models/url.model')
const app = express();
const PORT = 8001;

//middleware for parsing
app.use(express.urlencoded({extended:false}));
app.use(express.json());

connectToMongoDB('mongodb://127.0.0.1:27017/short-url')


app.use('/url', urlRoute);

app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId
    }, { $push: {
        visitHistory: {
            timestamp: Date.now(),
        }
    }})

    res.redirect(entry.redirectURL);
})

app.listen(PORT, () => {
    console.log(`Server is running http://localhost:${PORT} PORT`)
})
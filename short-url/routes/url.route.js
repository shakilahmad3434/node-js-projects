const express = require('express');
const router = express.Router();
const {handleGenerateNewShortURL, handleGetAnalytics, handleRedirectURL} = require('../controllers/url.controller')

// Route to Render homepage.ejs
router.get('/', (req, res) => {
    res.render('homepage'); // Renders views/homepage.ejs
});

router.post('/url', handleGenerateNewShortURL);

router.get('/:shortId', handleRedirectURL)

router.get('/analytics/:shortId', handleGetAnalytics)


module.exports = router;

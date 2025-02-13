const shortid = require('shortid');
const URL = require('../models/url.model')

async function handleGenerateNewShortURL(req, res){
    try {
        const origURL = req.body.url;
        // Check if URL is provided
      if (!origURL) {
        return res.status(400).json({ error: "URL is required" });
      }

      // Add 'https://' if the URL does not start with 'http://' or 'https://'
      let fullURL = origURL.trim();
      if (!fullURL.startsWith('http://') && !fullURL.startsWith('https://')) {
        fullURL = `https://${fullURL}`;
      }

      // Generate a short ID
      const shortID = shortid();
      // Save to the database
      await URL.create({
        shortId: shortID,
        redirectURL: fullURL,
        visitHistory:[],
      });

      // Send success response
      res.json({ message: `Short URL created successfully! http://localhost:8001/${shortID}` });

    } catch (error) {
        console.log(error)
    }
}

async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;
    const result = await URL.findOne({shortId});
    return res.json({totalClicks: result.visitHistory.length, analytics:result.visitHistory})

}

async function handleRedirectURL(req, res){
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
}

module.exports = {
    handleGenerateNewShortURL,
    handleGetAnalytics,
    handleRedirectURL
}
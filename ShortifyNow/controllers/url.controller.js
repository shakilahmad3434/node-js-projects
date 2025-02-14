
const UAParser = require("ua-parser-js");
const crypto = require("crypto");
const axios = require("axios");
const dotenv = require('dotenv')
dotenv.config()

const User = require("../models/url.models");

// Device Info
function getDeviceInfo(userAgent) {
  const parser = new UAParser();
  const result = parser.setUA(userAgent).getResult();
  return {
    device: result.device.type || "desktop", // mobile, tablet, desktop
    browser: result.browser.name,
    os: result.os.name,
  };
}

// Country Info
async function getLocation(ip) {
  try {
    const token = "92a388cbad8be3"; // Your ipinfo.io token
    const url = `https://ipinfo.io/${ip}?token=${token}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching location:", error.message);
    return null;
  }
}

async function handleGetRequest(req, res) {
  try {
    // Extract IP address & this code is a only live server on your deployment
    // const ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip).replace('::ffff:', '');
    // console.log('User IP:', ip);

    // this is a only localhost system
    const ip = "103.207.125.164";

    // Get location data
    const location = await getLocation(ip);

    // Get device info
    const userAgent = req.headers["user-agent"];
    const deviceInfo = getDeviceInfo(userAgent);

    const shortId = req.params.shortId;

    // Update the database with visit history, device info, and location
    const updateData = {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
        deviceInfo: {
          device: deviceInfo.device,
          browser: deviceInfo.browser,
          os: deviceInfo.os,
        },
      },
    };

    // Add location data if available
    if (location) {
      updateData.$push.locationInfo = {
        country: location.country,
        region: location.region,
        city: location.city,
      };
    }

    const findRes = await User.findOneAndUpdate({ shortId }, updateData);
    console.log(findRes);
    if (!findRes) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    res.redirect(findRes.originalURL);
  } catch (error) {
    console.error("Error in handleGetRequest:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function handleGenerateURL(req, res) {
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
      const shortID = crypto.randomBytes(8).toString("hex");
      // Save to the database
      await User.create({
        originalURL: fullURL,
        shortId: shortID,
        visitHistory: [],
        deviceInfo: [],
        locationInfo: [],
        createdBy: req.session.userId
      });
  
      // Send success response
      res.json({ message: `Short URL created successfully! http://localhost:5001/${shortID}` });
    } catch (error) {
      console.error("Error in handleGenerateURL:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

async function handleGetAnalytics(req, res) {
  try {
    const shortId = req.params.shortId;
    const findRes = await User.findOne({ shortId });

    if (!findRes) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    res.json({
      totalClicks: findRes.visitHistory.length,
      analytics: findRes.visitHistory,
      deviceInfo: findRes.deviceInfo,
      locationInfo: findRes.locationInfo,
    });
  } catch (error) {
    console.error("Error in handleGetAnalytics:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// get all data on homepage
async function handleGetAllData(req, res) {
  
  const allURLInfo = await User.find({ createdBy: req.session.userId });
  const PORT = process.env.PORT;
  res.render("home", {allURLInfo, PORT});
}

module.exports = {
  handleGetRequest,
  handleGenerateURL,
  handleGetAnalytics,
  handleGetAllData,
};

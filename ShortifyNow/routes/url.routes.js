const express = require("express");
const router = express.Router();

const {
  handleGetRequest,
  handleGenerateURL,
  handleGetAnalytics,
  handleGetAllData,
} = require("../controllers/url.controller");

const { handleSignupPage, handleSignupForm, handleLoginPage, handleLoginForm } = require("../controllers/user.controller");

function isLoggedIn(req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.redirect("/user/login");
  }
}

router.get("/", isLoggedIn, handleGetAllData);

router.get('/user/signup', handleSignupPage);
router.post('/user/signup', handleSignupForm);

router.get('/user/login', handleLoginPage);
router.post('/user/login', handleLoginForm);

router.get("/:shortId", handleGetRequest);

router.get("/analytics/:shortId", handleGetAnalytics);

router.post("/url", handleGenerateURL);

module.exports = router;

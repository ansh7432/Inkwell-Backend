const express = require("express");
const router = express.Router();

const {getHomeRoute} = require("../contols/userControlls.js");

router.get("/", getHomeRoute);
module.exports = router;
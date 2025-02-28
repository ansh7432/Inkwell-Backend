const express = require("express");
const router = express.Router();

const {authRoute} = require("../contols/userControlls.js");

router.get("/", authRoute);
module.exports = router;

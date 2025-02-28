const express = require("express");
const router = express.Router();

const {getUsername} = require("../contols/userControlls.js");

router.get("/", getUsername);

module.exports = router;

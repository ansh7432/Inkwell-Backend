const express = require("express");
const router = express.Router();

const {postLoginRoute} = require("../contols/userControlls.js");

router.post("/", postLoginRoute);
module.exports = router;
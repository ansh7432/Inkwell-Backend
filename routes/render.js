const express = require("express");
const router = express.Router();

const {render} = require("../contols/userControlls.js");

router.get("/", render);
module.exports = router;
const express = require("express");
const router = express.Router();

const { postRegisterRoute } = require("../contols/userControlls.js");

router.post("/", postRegisterRoute);
module.exports = router;

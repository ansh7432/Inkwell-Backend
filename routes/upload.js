const express = require("express");
const router = express.Router();

const {uploadRoute} = require("../contols/userControlls.js");
const {getUploadRoute} = require("../contols/userControlls.js");

router.get("/", getUploadRoute);
router.post("/", uploadRoute);
module.exports = router;
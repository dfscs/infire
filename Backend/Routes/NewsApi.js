const express = require("express");
const router = express.Router();
const newscontroller = require("../Controllers/newscontroller");

router.get("/", newscontroller.getAllNews);

module.exports = router;
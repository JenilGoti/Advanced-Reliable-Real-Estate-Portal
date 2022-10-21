
const express = require("express");

const indexController = require("../controllers/index");

const router = express.Router();

router.get('/',indexController.getIndex)

module.exports = router;
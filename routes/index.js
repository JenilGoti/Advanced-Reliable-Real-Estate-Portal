
const express = require("express");

const indexController = require("../controllers/index");

const router = express.Router();

router.get('/',indexController.getIndex);
router.get('/',indexController.getAbout);

module.exports = router;
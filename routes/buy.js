const express = require("express");

const buyController = require("../controllers/buy");

const router = express.Router();

router.get('/buy', buyController.getBuy);

module.exports = router;
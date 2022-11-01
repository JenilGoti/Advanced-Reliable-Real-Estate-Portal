
const express = require("express");

const rentController = require("../controllers/rent");

const router = express.Router();

router.get('/rent',rentController.getRent);

module.exports = router;
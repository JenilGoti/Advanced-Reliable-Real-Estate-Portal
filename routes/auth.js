
const express = require("express");

const authController = require('../controllers/auth');

const router = express.Router();

router.get("/singup",authController.getSingup)

router.get("/login",authController.getLogin)

module.exports = router;
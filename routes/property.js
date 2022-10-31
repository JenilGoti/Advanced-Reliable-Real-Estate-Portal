const {
    isAuth
} = require('../middleware/is-auth');

const express = require("express");

const indexController = require("../controllers/property");

const router = express.Router();

router.get('/:page', indexController.getProperty);

module.exports = router;
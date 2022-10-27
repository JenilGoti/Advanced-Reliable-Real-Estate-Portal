const {isAuth} = require('../middleware/is-auth');

const express = require("express");

const indexController = require("../controllers/index");

const router = express.Router();

router.get('/',indexController.getIndex);

router.get('/profile/:userid',indexController.getProfile);

router.get('/DE-report',indexController.getReport);

router.get('/about',indexController.getAbout);

module.exports = router;
const {isAuth} = require('../middleware/is-auth');

const express = require("express");

const indexController = require("../controllers/index");

const router = express.Router();

router.get('/',indexController.getIndex);

router.get('/:userid',indexController.getProfile);

router.get('/about',indexController.getAbout);

module.exports = router;
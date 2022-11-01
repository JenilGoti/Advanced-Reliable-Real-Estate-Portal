const {
    isAuth
} = require('../middleware/is-auth');

const express = require("express");

const indexController = require("../controllers/property");

const router = express.Router();

router.get('/:page', indexController.getProperty);

// router.get('/bookmark/:id', indexController.getBookmark);

// router.get('like/:id', indexController.getLike);

router.post('/bookmark/:id', indexController.postBookmark);

router.post('like/:id', indexController.postLike);

module.exports = router;
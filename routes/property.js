const {
    isAuth
} = require('../middleware/is-auth');

const express = require("express");

const indexController = require("../controllers/property");

const router = express.Router();

router.get('/', indexController.getPropertys);

router.get('/:propId', indexController.getProperty);

router.get('/bookmark/:id',isAuth, indexController.getBookmark);

router.get('/like/:id',isAuth, indexController.getLike);

router.post('/bookmark/:id',isAuth, indexController.postBookmark);

router.post('/like/:id',isAuth, indexController.postLike);

module.exports = router;
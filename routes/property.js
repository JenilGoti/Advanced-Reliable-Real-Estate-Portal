const {
    isAuth
} = require('../middleware/is-auth');

const express = require("express");

const propertyController = require("../controllers/property");

const router = express.Router();

router.get('/', propertyController.getPropertys);

router.get('/locations', propertyController.getLocations);

router.get('/:propId', propertyController.getProperty);

router.get('/bookmark/:id',isAuth, propertyController.getBookmark);

router.get('/like/:id',isAuth, propertyController.getLike);

router.get('/search/:search', propertyController.searchProperty);

router.post('/bookmark/:id',isAuth, propertyController.postBookmark);

router.post('/like/:id',isAuth, propertyController.postLike);

module.exports = router;
const express = require("express");
const {
    body,
    check
} = require("express-validator")

const {
    isAuth
} = require('../middleware/is-auth')

const authController = require('../controllers/auth');

const User = require('../models/user');

const router = express.Router();

router.get("/singup", authController.getSingup);

router.get("/login", authController.getLogin);

router.get("/verification/:credential", isAuth, authController.getVerification);

router.get("/verify/:credential/:tokan",authController.getVerify)

router.post("/singup", [
    check('firstName')
    .trim()
    .isLength({
        min: 2
    })
    .withMessage("name has atleast 2 charectoe")
    .isAlpha()
    .withMessage("Name must be alphabetic"),
    check('lastName')
    .trim()
    .isLength({
        min: 2
    })
    .isAlpha()
    .withMessage("Name must be alphabetic"),

    check('eMail')
    .isEmail()
    .withMessage('Please enter the valid email')
    .custom((value, {
        req
    }) => {
        return User.findOne({
                "user_email.email": value
            })
            .then(userDoc => {
                if (userDoc) {
                    return Promise.reject('E-mail already exist,please pike a diffrent one.');
                }
            });
    })
    .normalizeEmail(),
    body('password', 'Please enter a password with only numbers and text and at least 5 characters.').isLength({
        min: 5
    })
    .trim(),
    check('cinformPassword').custom((value, {
        req
    }) => {
        if (value !== req.body.password) {
            throw new Error('Password Have to match!');
        }
        return true;
    })
    .trim()
], authController.postSingup);

router.post("/login", [body('eMail')
    .isEmail()
    .withMessage('Please enter the valid email')
    .custom((value, {
        req
    }) => {
        return User.findOne({
                "user_email.email": value
            })
            .then(userDoc => {
                if (!userDoc) {
                    return Promise.reject('wrong email.');
                }
            });
    })
    .normalizeEmail(),
    body('password')
    .isAlphanumeric()
    .trim()
], authController.postLogin);

router.post("/verification/:credential", isAuth, authController.postVerification);

router.post("/logout", isAuth, authController.postLogout)


module.exports = router;
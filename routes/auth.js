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
const {
    multerSingleFile
} = require("../utils/firebase-helper");

const router = express.Router();

router.get("/singup", authController.getSingup);

router.get("/login", authController.getLogin);

router.get("/verification/:credential", isAuth, authController.getVerification);

router.get("/reset-password", authController.getResetPassword);

router.get("/verify/:credential/:tokan", authController.getVerify)

router.get("/edit-phone-no", isAuth, authController.getEditPhoneNo)

router.get("/verify-succesfullscreen", authController.getVerifySucessfullScreen)

router.get("/address", isAuth, authController.getAddress);

router.get("/edit-user-photo", isAuth, authController.getEditUserPhoto);

router.get("/new-password/:tokan", authController.getNewPassword);

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
    body('password', 'Please enter a password with  at least 5 characters.').isLength({
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
    .trim()
], authController.postLogin);

router.post("/send-otp", isAuth, authController.postSendOtp);

router.post("/verify-otp", isAuth, authController.postVerifyOtp);

router.post("/verification/:credential",
    [check('email')
        .isEmail()
        .withMessage('Please enter the valid email')
        .custom((value, {
            req,
            res
        }) => {
            return User.findOne({
                    "user_email.email": value
                })
                .then(userDoc => {
                    if (userDoc) {
                        if (userDoc._id.toString() !== req.session.user._id.toString()) {
                            return Promise.reject('E-mail already exist,please pike a diffrent one.');
                        }
                    }
                });
        })
        .normalizeEmail()
    ], isAuth, authController.postVerification);

router.post("/reset-password", [body('email')
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
    .normalizeEmail()
], authController.postResetPassword);

router.post("/new-password", authController.postNewPassword)

router.post("/editAddress", isAuth, authController.postAddress);

router.post("/upload-user-image", multerSingleFile, authController.postUserImage);

router.post("/set-notification-tokan", isAuth, authController.postNotificationTokan);

router.post("/logout", isAuth, authController.postLogout)


module.exports = router;
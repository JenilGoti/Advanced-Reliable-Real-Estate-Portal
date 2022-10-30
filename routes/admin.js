const express = require("express");

const adminController = require("../controllers/admin");

const {
    isAuth
} = require("../middleware/is-auth");

const {multerMultipaleFile}=require("../utils/firebase-helper")
const router = express.Router();

router.get("/add-property", isAuth, adminController.getAddNewProperty);

router.post("/add-property", isAuth,multerMultipaleFile, adminController.postAddNewProperty);

module.exports = router;
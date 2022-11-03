const express = require("express");

const adminController = require("../controllers/admin");

const {
    isAuth
} = require("../middleware/is-auth");

const {multerMultipaleFile}=require("../utils/firebase-helper")
const router = express.Router();

router.get("/",isAuth,adminController.getAdmin);

router.get("/add-property", isAuth, adminController.getAddNewProperty);

router.delete("/delete-property", isAuth, adminController.getAddNewProperty);

router.get('/bookmark',isAuth,adminController.getBookMarks);

router.post("/add-property", isAuth,multerMultipaleFile, adminController.postAddNewProperty);

module.exports = router;
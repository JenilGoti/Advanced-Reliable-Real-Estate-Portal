const user = require('../models/user');
const path = require("path");
const fs = require("fs");
const Property = require("../models/property");
exports.getIndex = (req, res, next) => {
    Property.find()
        .populate("userId")
        .then(propertys => {
            res.render("index/index", {
                pageTitle: "NESTSCOUT",
                path: '/',
                property: propertys
            });
        })
        .catch(err => {
            console.log(err);
            const error = new Error("data not found");
            error.statusCode = 404;
            error.discription = "required data not found"
            return next(error);
        })



}

exports.getProfile = (req, res, next) => {
    const userid = req.param('userid');
    const master = (userid == res.locals.user._id);
    user.findById(userid)
        .select('user_type user_thumbnail user_email user_phone_no firstName lastName user_address')
        .then(user => {
            res.render("index/profile", {
                pageTitle: user.firstName + " " + user.lastName,
                path: '/profile',
                profUser: user,
                master: master
            });
        })
        .catch(err => {
            next();
        })

}

exports.getReport = (req, res, next) => {
    const invoiceName = 'de-report.pdf';
    const reportPath = path.join('data', invoiceName);
    const file = fs.createReadStream(reportPath);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
    file.pipe(res);
}

exports.getAbout = (req, res, next) => {
    res.render("index/about", {
        pageTitle: "About",
        path: '/about',
    });
}
const user = require('../models/user');
const path = require("path");
const fs = require("fs");
exports.getIndex = (req, res, next) => {
    res.render("index/index", {
        pageTitle: "NESTSCOUT",
        path: '/'
    });
}

exports.getProfile = (req, res, next) => {
    const userid = req.param('userid');
    const master = (userid == res.locals.user._id);
    user.findById(userid)
        .select('user_thumbnail user_email user_phone_no firstName lastName user_address')
        .then(user => {
            res.render("index/profile", {
                pageTitle: user.firstName+" " + user.lastName,
                path: '/profile',
                profUser: user,
                master: master
            });
        })
        .catch(err => {
            next();
        })

}

exports.getReport=(req,res,next)=>{
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
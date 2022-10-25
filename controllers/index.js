const user = require('../models/user');
exports.getIndex = (req, res, next) => {
    res.render("index/index", {
        pageTitle: "NESTSCOUT",
        path: '/'
    });
}

exports.getProfile = (req, res, next) => {
    const userid = req.param('userid');
    const master = (userid == res.locals.user._id);
    console.log(master);
    user.findById(userid)
        .select('user_thumbnail user_email user_phone_no firstName lastName')
        .then(user => {
            res.render("index/profile", {
                pageTitle: "About",
                path: '/about',
                profUser: user,
                master: master
            });
        })
        .catch(err => {
            next();
        })



}

exports.getAbout = (req, res, next) => {
    res.render("index/about", {
        pageTitle: "About",
        path: '/about'
    });
}
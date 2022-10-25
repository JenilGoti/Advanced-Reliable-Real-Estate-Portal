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
    user.findById(userid)
        .select('user_thumbnail user_email user_phone_no firstName lastName user_address')
        .then(user => {
            console.log(user);
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
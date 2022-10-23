const user = require('../models/user');
exports.getIndex = (req, res, next) => {
    res.render("index/index", {
        pageTitle: "NESTSCOUT",
        path: '/'
    });
}

exports.getProfile = (req, res, next) => {
    userid = req.param('userid');
    user.findById(userid)
        .select('user_thumbnail user_email user_phone_no firstName lastName')
        .then(user => {
            console.log(user);
            res.render("index/profile", {
                pageTitle: "About",
                path: '/about',
                user:user
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
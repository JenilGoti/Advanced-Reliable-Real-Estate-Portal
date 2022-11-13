const User = require("../models/user")

exports.setLocals = (req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn||false;
    res.locals.user = {};
    if (req.session.isLoggedIn||false) {
        User.findById(req.session.user._id)
            .then(user => {
                if (user!==null) {
                    res.locals.user = user;
                    next();
                } else {
                    res.locals.isAuthenticated = false;
                    next();
                }
            })
            .catch(err => {
                console.log(err);
                const error = new Error("log in fail");
                error.statusCode = 401;
                error.discription = "log in faild duto some issues"
                next(error);
            })
    }
    else{
       next(); 
    }
    
};
exports.isAuth = (req, res, next) => {
    console.log(req.session);
    if (!req.session.isLoggedIn) {
        const error = new Error("not authenti cated");
        error.statusCode = 401;
        error.discription = "you cant reach this page you are not authentiated"
        return next(error);
    }
    next();
}
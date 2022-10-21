exports.getIndex = (req, res, next) => {
    res.render("index/index", {
        pageTitle: "NESTSCOUT",
        path: '/'
    });
    
}

exports.getAbout = (req, res, next) => {
    res.render("index/about", {
        pageTitle: "About",
        path: '/about'
    });
}
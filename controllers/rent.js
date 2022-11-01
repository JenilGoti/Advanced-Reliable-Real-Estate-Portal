exports.getRent = (req, res, next) => {
    res.render("rent/rent", {
        pageTitle: "rent",
        path: '/rent/rent'
    });
}
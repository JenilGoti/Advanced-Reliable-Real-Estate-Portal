exports.getBuy = (req, res, next) => {
    res.render("buy/buy", {
        pageTitle: "Buy",
        path: '/buy/buy'
    });
}
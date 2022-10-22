exports.error404=(req,res,next)=>{
        res.render("error/error", {
            pageTitle: "404:ERROR",
            path: "",
            errorCode: 404,
            errorLable: "Look like you're lost",
            errorDiscription: "the page you are looking for not avaible!"
        });
}
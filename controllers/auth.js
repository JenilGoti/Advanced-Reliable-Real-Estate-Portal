exports.getSingup = (req,res,next)=>{
    res.render("auth/singup",{
            pageTitle: "sing up",
            path: '/singup'
    })
}

exports.getLogin = (req,res,next)=>{
    res.render("auth/login",{
        pageTitle: "login",
        path: '/login'
})
}
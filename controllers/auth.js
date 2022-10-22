const bcrypt = require('bcryptjs');
const User = require("../models/user");
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const {
    validationResult
} = require("express-validator")


exports.getSingup = (req, res, next) => {
    res.render("auth/singup", {
        pageTitle: "sing up",
        path: '/singup',
        error: {},
        oldInput: {}
    })
}

exports.getLogin = (req, res, next) => {
    res.render("auth/login", {
        pageTitle: "login",
        path: '/login',
        error: {},
        oldInput: {}
    })
}


exports.postSingup = (req, res, next) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.eMail;
    const password = req.body.password;
    const error = validationResult(req);
    firstNameError = null;
    lastNameError = null;
    emailError = null;
    passwordError = null;
    error.array().forEach(err => {
        if (err.param === 'firstName') {
            firstNameError = err.msg;
        }
        if (err.param === 'lastName') {
            lastNameError = err.msg;
        }
        if (err.param === 'eMail') {
            emailError = err.msg;
        }
        if (err.param === 'password') {
            passwordError = err.msg;
        }
    })

    if (error.array().length > 0) {
        return res.render("auth/singup", {
            pageTitle: "sing up",
            path: '/singup',
            error: {
                firstName:firstNameError,
                lastName:lastNameError,
                email:emailError,
                password:passwordError,
            },
            oldInput: {
                firstName:firstNameError?'':firstName,
                lastName:lastNameError?'':lastName,
                email:emailError?'':email,
                password:passwordError?'':password
            }
        })
    }

    bcrypt.hash(password, 12)
        .then(hasedpassword => {
            const user = new User({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: hasedpassword
            });
            return user.save()
        })
        .then(result => {
            console.log(result);
            res.redirect("/login");
        })
        .catch(err => {
            const error = new Error("sing in fail");
            error.statusCode = 401;
            error.discription = "sing in faild duto some issues"
            next(error);
        })

};

exports.postLogin = (req, res, next) => {
    const email = req.body.eMail;
    const password = req.body.password;
    const error = validationResult(req);
    emailError = null;
    passwordError = null;
    let currentUser;
    error.array().forEach(err => {
        if (err.param === 'eMail') {
            emailError = err.msg;
        }
        if (err.param === 'password') {
            passwordError = err.msg;
        }
    })

    if (error.array().length > 0) {
        return res.render("auth/login", {
            pageTitle: "login",
            path: '/login',
            error: {
                email: emailError,
                password: passwordError
            },
            oldInput: {
                email: emailError ? "" : email,
                password: (passwordError || emailError) ? "" : password
            }
        });
    }


    User.findOne({
            email: email
        })
        .then(user => {
            console.log(user);
            if (user == null) {
                res.redirect("/login");
            } else {
                currentUser=user;
                return bcrypt.compare(password, user.password)
            }

        })
        .then(result => {
            if (result) {
                req.session.isLoggedIn = true;
                req.session.user = currentUser;
                return req.session.save(err=>{
                    if(err){
                        console.log(err);
                    }
                    res.redirect("/");
                });
                
            } else {
                res.render("auth/login", {
                    pageTitle: "login",
                    path: '/login',
                    error: {
                        email: emailError,
                        password: "wrong password try again"
                    },
                    oldInput: {
                        email: email,
                        password: ""
                    }
                });
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

exports.postLogout = (req,res,next)=>{
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        }
        res.redirect('/')
    })
}
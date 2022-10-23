const bcrypt = require('bcryptjs');
const User = require("../models/user");
const crypto = require('crypto');
const {
    validationResult
} = require("express-validator")

const {
    sendMail
} = require("../utils/mail-helper");
const user = require('../models/user');


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
                firstName: firstNameError,
                lastName: lastNameError,
                email: emailError,
                password: passwordError,
            },
            oldInput: {
                firstName: firstNameError ? '' : firstName,
                lastName: lastNameError ? '' : lastName,
                email: emailError ? '' : email,
                password: passwordError ? '' : password
            }
        })
    }

    bcrypt.hash(password, 12)
        .then(hasedpassword => {
            const user = new User({
                firstName: firstName,
                lastName: lastName,
                user_email: {
                    email: email
                },
                password: hasedpassword
            });
            return user.save()
        })
        .then(result => {
            console.log(result);
            res.redirect("/login");
        })
        .catch(err => {
            console.log(err);
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
            "user_email.email": email
        })
        .then(user => {
            console.log(user);
            if (user == null) {
                res.redirect("/login");
            } else {
                currentUser = user;
                return bcrypt.compare(password, user.password)
            }

        })
        .then(result => {
            if (result) {
                req.session.isLoggedIn = true;
                req.session.user = currentUser;
                return req.session.save(err => {
                    if (err) {
                        console.log(err);
                    }
                    sendMail(email, 'Login Succesfull', "<h1>you are log-in succesfully in ARREP</h1>")
                        .then(result => {
                            console.log("mail sended sucesfully");
                        })
                        .catch(err => {
                            console.log(err);
                        })
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


exports.getVerification = (req, res, next) => {
    credential = req.param('credential');
    email = res.locals.user.user_email.email;
    res.render("auth/verification", {
        pageTitle: "verification",
        path: '/verification',
        verify: credential,
        type: "email",
        value: email,
        requested: false
    })
}
exports.postVerification = (req, res, next) => {
    credential = req.param('credential');
    console.log(credential);
    email = res.locals.user.user_email.email;
    new_email = req.body.email;
    let tokan;
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/verification/' + credential)
        }
        tokan = buffer.toString('hex');

        User.findOne({
                "user_email.email": email
            })
            .then(user => {
                user.user_email.new_mail = new_email;
                user.user_email.resetToken = tokan;
                user.user_email.resetTokenExpiration = Date.now() + 3600000;
                return user.save();
            })
            .then(result => {
                sendMail(new_email, "Verify Email", verificationMail(req.protocol + '://' + req.get('host') + '/verify/email/' + tokan))
                    .then(result => {
                        console.log("code sended succesfully");
                    })
                    .catch(err => console.log(err))

                res.render("auth/verification", {
                    pageTitle: "verification",
                    path: '/verification',
                    verify: credential,
                    type: "email",
                    value: email,
                    requested: true
                })
            })
            .catch(err => {
                console.log(err);
                const error = new Error("Internal Server Error");
                error.statusCode = 500;
                error.discription = "this is server side issue we are workink on it"
                next(error);
            })


    })
}

exports.getVerify = (req, res, next) => {
    const credintial = req.param('credential');
    const tokan = req.param('tokan');
    User.findOne({
            "user_email.resetToken": tokan,
            resetTokenExpiration: {
                $gt: Date.now()
            }
        })
        .then(user => {
            if (user) {
                user.user_email.email = user.user_email.new_mail;
                user.user_email.verification_status=true;
                user.user_email.new_mail = null;
                user.user_email.resetToken = null;
                user.user_email.resetTokenExpiration = null;
                return user.save();
            } else {
                const error = new Error("401 Unauthorized HTTP");
                error.statusCode = 401;
                error.discription = "this session can be expired"
                next(error);
            }
        })
        .then(result => {
            res.render("auth/sucessfulscreen", {
                pageTitle: "sucessfull",
                path: "",
            });
        })
        .catch(err => {
            // console.log(err);
            const error = new Error("401 Unauthorized HTTP");
            error.statusCode = 401;
            error.discription = "this session can be expired"
            next(error);
        })
}


exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        }
        res.redirect('/')
    })
}





verificationMail = (url) => {
    console.log(url);


    const body = `
<div style="margin: 5rem 3rem;
            background-image: linear-gradient(to top, #14213d, #14213ddc);
            align-items: center;
            padding: 30px;    
            border-radius: 5px;    
            box-shadow: 2px 2px 2px 2px #14213d6e;    
            text-align: center;">
        <h1 style="font-size: xx-large;       
        border-bottom: #e5e5e5 solid 3px;        
        border-radius: 10px;        
        color: #e5e5e5;    
        font-family: 'Exo 2', sans-serif;">NESTSCOUT</h1>
        <br>
        <label style="             
        color: #e5e5e5;        
        margin-top: 15px;        
        margin-bottom: 4px;        
        font-size: large;" for="verification">this is email verification from Advanced Reliable Real Estate Portal
            (ARREP)</label>
        <h3 style="               
        color: #e5e5e5;        
        margin-top: 15px;       
         margin-bottom: 2rem;">
            click below to verify your email
        </h3>
        <a href="` + url + `" style="margin-top: 1rem;
        background-color: #E8AA42;
        font-weight: bolder;
        text-decoration: none;
        color: #14213d;
        font-size: large;
        text-align: center;
        width: 100%;
        margin-bottom: 0.25rem;
        padding: 1rem 3rem;
        border-radius: 4px;">verify</a>
    </div>
`


    return body;
}
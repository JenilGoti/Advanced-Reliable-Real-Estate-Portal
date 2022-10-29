const bcrypt = require('bcryptjs');
const User = require("../models/user");
const crypto = require('crypto');
const {
    validationResult
} = require("express-validator")

const {
    sendMail
} = require("../utils/mail-helper");
const {
    uploadFile
} = require("../utils/firebase-helper");

const user = require('../models/user');
const fast2sms = require('fast-two-sms')
var messagebird = require('messagebird')('ngcBgBmILcjHw2oeiVcClsTaH');
const request = require('request');


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
    const user_type = req.body.userType;
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
                user_type: user_type,
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
                    sendMail(email, "log-in succesfully in ARREP", loginEmail(req.protocol + '://' + req.get('host')))
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
        requested: false,
        error: {}
    })
}
exports.postVerification = (req, res, next) => {
    credential = req.param('credential');
    console.log(credential);
    email = res.locals.user.user_email.email;
    new_email = req.body.email;
    let tokan;
    const error = validationResult(req);
    emailError = null;
    error.array().forEach(err => {
        if (err.param === 'email') {
            emailError = err.msg;
        }
    })
    console.log(error);

    if (error.array().length > 0) {
        return res.render("auth/verification", {
            pageTitle: "verification",
            path: '/verification',
            verify: credential,
            type: "email",
            value: email,
            requested: false,
            error: {
                email: emailError,
            }
        })
    }
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
                    requested: true,
                    error: {}
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
            "user_email.resetTokenExpiration": {
                $gt: Date.now()
            }
        })
        .then(user => {
            if (user) {
                user.user_email.email = user.user_email.new_mail;
                user.user_email.verification_status = true;
                user.user_email.new_mail = null;
                user.user_email.resetToken = null;
                user.user_email.resetTokenExpiration = null;
                return user.save();
            } else {
                const error = new Error("401 Unauthorized HTTP");
                error.statusCode = 401;
                error.discription = "this session can be expired"
                return next(error);
            }
        })
        .then(result => {
            return res.redirect("/verify-succesfullscreen")
        })
        .catch(err => {
            console.log(err);
            const error = new Error("401 Unauthorized HTTP");
            error.statusCode = 401;
            error.discription = "this session can be expired"
            next(error);
        })
}

exports.getResetPassword = (req, res, next) => {
    res.render('auth/resetPassword', {
        path: '/reset',
        pageTitle: 'Reset Password',
        error: {},
    });

}


exports.postResetPassword = (req, res, next) => {
    let tokan;
    const error = validationResult(req);
    emailError = null;
    error.array().forEach(err => {
        if (err.param === 'email') {
            emailError = err.msg;
        }
    })
    console.log(error);

    if (error.array().length > 0) {
        return res.render('auth/resetPassword', {
            path: '/reset',
            pageTitle: 'Reset Password',
            error: {
                email: emailError
            }
        });
    }
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/reset')
        }
        tokan = buffer.toString('hex');
        User.findOne({
                'user_email.email': req.body.email
            })
            .then(user => {
                if (!user) {
                    res.redirect('/reset')
                }
                user.resetToken = tokan;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save();
            })
            .then(result => {
                const userName = result.firstName + ' ' + result.lastName;
                res.redirect('/');
                sendMail(req.body.email, "Reset password NESTSCOUT", resetPassword(userName, req.protocol + '://' + req.get('host') + '/new-password/' + tokan))
                    .then().catch(err => {
                        console.log(err);
                    })

            })
            .catch(err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            })
    })
}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.tokan;
    console.log(token);
    User.findOne({
        resetToken: token,
        resetTokenExpiration: {
            $gt: Date.now()
        }
    }).then(user => {
        res.render('auth/new-password', {
            path: '/new password',
            pageTitle: 'New Password',
            userId: user._id.toString(),
            passwordTokan: token
        });
    }).catch(err => {
        const error = new Error("your session has been expired");
        error.httpStatusCode = 500;
        return next(error);
    })
}

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordTokan = req.body.passwordTokan;

    let resetUser;
    User.findOne({
            resetToken: passwordTokan,
            resetTokenExpiration: {
                $gt: Date.now()
            },
            _id: userId
        }).then(user => {
            resetUser = user;
            return bcrypt.hash(newPassword, 12);
        })
        .then(hashedPassword => {
            resetUser.password = hashedPassword;
            resetUser.resetToken = null;
            resetUser.resetTokenExpiration = null;
            return resetUser.save()
        })
        .then(result => {
            res.redirect('/login');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });

}


exports.getEditPhoneNo = (req, res, next) => {
    const phoneNo = res.locals.user.user_phone_no.number;
    const pageTitle = phoneNo ? "Edit Phone No" : "Add Phone No"
    res.render("auth/editPhoneNo", {
        pageTitle: pageTitle,
        path: '/edit-phone-no',
        phoneNo: phoneNo
    })
}

exports.postSendOtp = (req, res, next) => {
    const newMobileNo = req.body.new_number;
    const userId = res.locals.user._id;
    otp = parseInt(99999 + Math.random() * 900000);
    if (process.env.USE_DEFALT_OTP == 'true') {
        otp = "999999";
    } else {
        otp = otp.toString();
    }
    console.log(otp);
    smsText = `Your OTP is ${otp}\n@reliable-real--estate-portal.herokuapp.com #${otp}`
    let hashedOtp;
    let currentUser;


    bcrypt.hash(otp, 12)
        .then(hash => {
            hashedOtp = hash;
            return User.findById(userId);
        })
        .then(user => {
            console.log(hashedOtp);
            user.user_phone_no.new_number = newMobileNo;
            user.user_phone_no.OTP = hashedOtp;
            user.user_phone_no.OTPExpiration = Date.now() + 120000;
            return user.save();
        })
        .then(result => {
            if (process.env.USE_SINCH == 'true') {
                return request({
                    method: 'POST',
                    uri: 'https://us.sms.api.sinch.com/xms/v1/' + process.env.SINCH_SERVICE_PLAN_ID + '/batches',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + process.env.SINCH_API_TOKEN
                    },
                    body: JSON.stringify({
                        from: process.env.SINCH_NUMBER,
                        to: ['91' + newMobileNo.toString()],
                        body: smsText
                    })
                }, (error, response, body) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).send({
                            statusCode: 500,
                            message: "otp request has been faild"
                        });
                    } else {
                        console.log(response);
                        console.log(smsText)

                        res.status(200).send({
                            statusCode: 200,
                            message: "otp sended sussesfully"
                        })
                    }
                })
            }




            // var params = {
            //     'originator': 'TestMessage',
            //     'recipients': [
            //       'RECIPIENT'
            //   ],
            //     'body': 'This is a test message'
            //   };

            //   return messagebird.messages.create(params, function (err, response) {
            //     if (err) {
            //         console.log(err);
            //       return res.status(500).send({
            //         statusCode: 500,
            //         message: "otp request has been faild"
            //     });
            //     }
            // console.log(smsText)
            //     console.log(response);
            //     res.status(200).send({
            //         statusCode: 200,
            //         message: "otp sended sussesfully"
            //     })
            //   });
            else {
                return fast2sms.sendMessage({
                        senderId: "FastSM",
                        authorization: process.env.SMS_API_KEY,
                        message: smsText,
                        numbers: [newMobileNo.toString()]
                    })
                    .then(response => {
                        console.log(response);
                        console.log(smsText)
                        console.log("otp sended succesfully");
                        res.status(200).send({
                            statusCode: 200,
                            message: "otp sended sussesfully"
                        })
                    })
            }

        })
        .catch(err => {
            console.log(err);
            return res.status(500).send({
                statusCode: 500,
                message: "otp request has been faild"
            });
        })




}

exports.postVerifyOtp = (req, res, next) => {
    const userId = res.locals.user._id;
    const OTP = req.body.OTP;
    let currentUser;
    User.findById(userId)
        .then(user => {
            currentUser = user;
            return bcrypt.compare(OTP.toString(), user.user_phone_no.OTP)
        })
        .then(result => {
            if (result) {
                currentUser.user_phone_no.number = currentUser.user_phone_no.new_number;
                currentUser.user_phone_no.verification_status = true;
                currentUser.user_phone_no.new_number = null;
                currentUser.user_phone_no.OTP = null;
                currentUser.user_phone_no.OTPExpiration = null;
                return currentUser.save();
            } else {
                return false;
            }
        })
        .then(response => {
            if (response) {
                console.log(response);
                return res.status(200).send({
                    statusCode: 200,
                    message: "verify otp"
                });
            } else {
                res.status(400).send({
                    statusCode: 400,
                    message: "enterd wrong otp"
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(400).send({
                statusCode: 400,
                message: "enterd wrong otp"
            });
        })
}


exports.getVerifySucessfullScreen = (req, res, next) => {
    res.render("auth/sucessfulscreen", {
        pageTitle: "sucessfull",
        path: "",
    });
}

exports.getAddress = (req, res, next) => {
    res.render('address', {
        pageTitle: "Edit or Add address",
        path: "/profile/address"
    })
}

exports.postAddress = (req, res, next) => {
    const userId = res.locals.user._id;
    const apprtmentSuite = req.body.apprtmentSuite;
    const stritAddress = req.body.stritAddress;
    const contry = req.body.contry;
    const state = req.body.state;
    const city = req.body.city;
    User.findById(userId)
        .then(user => {
            user.user_address.apprtmentSuite = apprtmentSuite;
            user.user_address.stritAddress = stritAddress;
            user.user_address.contry = contry;
            user.user_address.state = state;
            user.user_address.city = city;
            return user.save();
        })
        .then(result => {
            if (result) {
                res.redirect("/profile/" + userId);
            }
        })
        .catch(err => {
            console.log(err);
            const error = new Error("user not found");
            error.statusCode = 404;
            error.discription = "you are not authenticated user"
            next(error);
        })
}

exports.getEditUserPhoto = (req, res, next) => {
    const userImage = res.locals.user.user_thumbnail;
    res.render('auth/edit-user-photo', {
        pageTitle: "edit user photo",
        path: "/auth/edit-user-photo",
        userImage: userImage
    })
}

exports.postUserImage = async (req, res, next) => {
    try {
        const userId = res.locals.user._id;
        const userPicSmall = await uploadFile(req.file, "/users/" + userId + "/", userId + "_180x180.jpeg", 180, 180);
        const userPicmidium = await uploadFile(req.file, "/users/" + userId + "/", userId + "_320x320.jpeg", 320, 320);
        const userPiclarge = await uploadFile(req.file, "/users/" + userId + "/", userId + "_1080x1080.jpeg", 1080, 1080);
        if (userPicSmall.length === 0 || userPicmidium.length === 0 || userPiclarge.length === 0) {
            return res.redirect("/edit-user-photo")
        }
        User.findById(userId)
            .then(user => {
                user.user_thumbnail = {
                    small: userPicSmall[0],
                    middium: userPicmidium[0],
                    large: userPiclarge[0]
                }
                return user.save();
            })
            .then(result => {
                if (result) {
                    setTimeout(function () {
                        res.redirect("/profile/" + userId);
                    }, 2000);

                } else {
                    return res.redirect("/edit-user-photo")
                }
            })
            .catch(err => {
                console.log(err);
                const error = new Error("user not found");
                error.statusCode = 404;
                error.discription = "you are not authenticated user"
                next(error);
            })
    } catch (err) {
        console.log(err);
        const error = new Error("something wents wrong");
        error.statusCode = 500;
        error.discription = "It is server side issue,we working on it"
        next(error);
    }
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
        font-size: large;" for="verification">This is Email verification from Advanced Reliable Real Estate Portal
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

loginEmail = (url) => {
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
        font-size: large;" for="verification">Log-in Successfully! to Advanced Reliable Real Estate Portal (ARREP)</label>
        <h3 style="               
        color: #e5e5e5;        
        margin-top: 15px;       
        margin-bottom: 2rem;">
            you are log-in succesfully in ARREP
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
        border-radius: 4px;">GO TO NESTSCOUT</a>
    </div>
`


    return body;
}

resetPassword = (username, url) => {
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
        font-size: large;" for="verification">This is Password Reset link from Advanced Reliable Real Estate Portal(ARREP) to ` + username + `</label>
        <h3 style="               
        color: #e5e5e5;        
        margin-top: 15px;       
         margin-bottom: 2rem;">
            click below to reset password
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
        border-radius: 4px;">Reset Password</a>
    </div>
`


    return body;
}
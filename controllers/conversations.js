const Message = require("../models/message");
const Property = require("../models/property");
const User = require("../models/user");
const io = require('../socket');
const mongoose = require('mongoose');
const {
    sendNotification
} = require("../utils/firebase-helper");

exports.getConversation = (req, res, next) => {
    Message.find({
            'users.user': {
                "$in": [res.locals.user._id]
            }
        })
        .sort({
            createdAt: -1
        })
        .distinct('users.user')
        .then(result => {
            result = result.filter((_id) => {
                return res.locals.user._id.toString() !== _id.toString()
            })
            return User.find({
                    _id: {
                        "$in": result
                    }
                })
                .select("user_thumbnail.small firstName lastName")
        })
        .then(result => {
            res.render("conversation/conversation", {
                pageTitle: "conversation",
                path: '/conversations',
                connectedUsers: result
            });
        })
        .catch(err => {
            console.log(err);
            const error = new Error("Data not found");
            error.statusCode = 404;
            error.discription = "Data not found"
            next(error);
        })
}

exports.getConversationForProp = (req, res, next) => {
    const propId = req.params["propId"];
    var currentProperty;
    Property.findById(propId)
        .select("userId")
        .populate({
            path: "userId",
            select: "user_thumbnail.small firstName lastName"
        })
        .then(property => {
            currentProperty = property
            return Message.find({
                    $and: [{
                            'users.user': {
                                "$in": [res.locals.user._id]
                            }
                        },
                        {
                            'users.user': {
                                "$in": [property.userId]
                            }
                        },
                        {
                            'message.property': mongoose.Types.ObjectId(propId)
                        }
                    ]
                })
                .sort({
                    updatedAt: -1
                })
                .limit(1);
        })
        .then(mes => {
            if (mes.length < 1) {
                const message = new Message({
                    message: {
                        mType: 'property',
                        text: 'inquiry about property',
                        property: currentProperty._id
                    },
                    users: [{
                            user: res.locals.user._id
                        },
                        {
                            user: currentProperty.userId._id
                        }
                    ],
                    sender: res.locals.user._id
                });
                const userS = res.locals.user
                sendNotification([currentProperty.userId._id],
                    userS.firstName + " " + userS.lastName + " is intrested in your property on NESTSCOUT",
                    message.message.text,
                    req.protocol + '://' + req.get('host') + "/conversations/chat-box/" + userS._id,
                    userS.user_thumbnail.small
                )
                return message.save();
            } else {
                console.log("message found");
                mes[0].upTime = new Date();
                return mes[0].save();
            }
        })
        .then(message => {
            // console.log(message);
            res.redirect('/conversations/chat-box/' + currentProperty.userId._id.toString());
        })
        .catch(err => {
            console.log(err);
            const error = new Error("server side error");
            error.statusCode = 500;
            error.discription = "we are working on this issues"
            next(error);
        })
}

exports.getMessages = async (req, res, next) => {
    try {
        var mNum = req.query.mNum || 1;
        var user1 = req.query.user1;
        var user2 = req.query.user2;
        // console.log(mNum, user1, user2);
        totalMessage = await Message.find({
            $and: [{
                    'users.user': {
                        "$in": [user1]
                    }
                },
                {
                    'users.user': {
                        "$in": [user2]
                    }
                }
            ]
        }).countDocuments();
        const message = await Message.find({
                $and: [{
                        'users.user': {
                            "$in": [user1]
                        }
                    },
                    {
                        'users.user': {
                            "$in": [user2]
                        }
                    }
                ]
            })
            .sort({
                upTime: -1
            })
            .skip(mNum - 1)
            .limit(1);
        // console.log(message);
        return res.status(200).send({
            statusCode: 200,
            message: "data sended succesfully",
            mess: message[0],
            hasNext: mNum < totalMessage,
            totalMessage: totalMessage,
        });

    } catch (err) {
        console.log(err);
        return res.status(404).send({
            statusCode: 404,
            message: "Message not found",
        })
    }
}

exports.postMessage = (req, res, next) => {
    const text = req.body.text;
    const sender = res.locals.user._id;
    const reciver = req.body.userId;
    const message = new Message({
        message: {
            mType: 'text',
            text: text
        },
        users: [{
            user: sender
        }, {
            user: reciver
        }],
        sender: sender
    });
    message.save()
        .then(result => {
            io.getIO().in(reciver.toString()).emit('new_msg', {
                msg: result
            });
            io.getIO().in(sender.toString()).emit('new_msg', {
                msg: result
            });
            const userS = res.locals.user
            sendNotification([reciver],
                userS.firstName + " " + userS.lastName + "'s message on NESTSCOUT",
                text,
                req.protocol + '://' + req.get('host') + "/conversations/chat-box/" + userS._id,
                userS.user_thumbnail.small
            )
            return res.status(200).send({
                statusCode: 200,
                message: "message sended succesfully"
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(404).send({
                statusCode: 404,
                message: "Message not sended",
            })
        })
}

exports.getChatBox = (req, res, next) => {
    const userId = req.params["userId"];
    User.findById(userId)
        .select("user_thumbnail.small firstName lastName")
        .then(user => {
            res.render("conversation/chat-page", {
                pageTitle: "conversation",
                path: '/conversations',
                owner: user
            })
        })
        .catch(err => {
            console.log(err);
            const error = new Error("server side error");
            error.statusCode = 500;
            error.discription = "we are working on this issues"
            next(error);
        })

}


exports.getCamVisitBox = (req, res, next) => {
    const messId = req.params["messId"];
    // message.findById(messId)
    //     .then(message => {
            res.render("conversation/visit-page", {
                // pageTitle: "Live-Visit",
                // path: '/conversations',
                // message: message,
                RoomId: messId
            })
        // })
        // .catch(err => {
        //     console.log(err);
        //     const error = new Error("Visit not found");
        //     error.statusCode = 404;
        //     error.discription = "visit not found"
        //     next(error);
        // })
}


exports.postCamVisitRequest = (req, res, next) => {
    const propId = req.body.propId;
    const sender = res.locals.user._id;
    const reciver = req.body.userId;
    Message.find({
            'message.camVisit.property': mongoose.Types.ObjectId(propId)
        })
        .then(result => {
            if (result > 0) {
                result.message = {
                    mType: 'cam-visit',
                    text: res.locals.user.firstName + ' ' + res.locals.user.lastName + ' requeste for cam-visit',
                    camVisit: {
                        property: propId,
                        reqDate: new Date(),
                        status: 'requested',
                        visiter: sender
                    }
                }
                result.sender = sender;
                return result.save();
            } else {
                const message = new Message({
                    message: {
                        mType: 'cam-visit',
                        text: res.locals.user.firstName + ' ' + res.locals.user.lastName + ' requeste for cam-visit',
                        camVisit: {
                            property: propId,
                            reqDate: new Date(),
                            status: 'requested',
                            visiter: sender
                        }
                    },
                    users: [{
                        user: sender
                    }, {
                        user: reciver
                    }],
                    sender: sender
                });
                return message.save()
            }
        })
        .then(result => {
            io.getIO().in(reciver.toString()).emit('new_msg', {
                msg: result
            });
            io.getIO().in(sender.toString()).emit('new_msg', {
                msg: result
            });
            const userS = res.locals.user
            sendNotification([reciver],
                userS.firstName + " " + userS.lastName + "'s message on NESTSCOUT",
                result.message.text,
                req.protocol + '://' + req.get('host') + "/conversations/chat-box/" + userS._id,
                userS.user_thumbnail.small
            )

            return res.status(200).send({
                statusCode: 200,
                message: "message sended succesfully"
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(404).send({
                statusCode: 404,
                message: "Message not sended",
            })
        })
}

exports.postShedualCamVisit = (req, res, next) => {
    const owner = res.locals.user;
    const visiter = req.body.visiter;
    const messageId = req.body.messId;
    const shaduleDate = req.body.shaduleDate;
    // console.log(messageId);
    Message.findById(mongoose.Types.ObjectId(messageId))
        .then(message => {
            // console.log(shaduleDate);
            message.message.camVisit.shaduleDate = new Date(shaduleDate + ':00.000Z');
            // console.log(message.message.camVisit.shaduleDate);
            message.message.camVisit.status = 'scheduled';
            message.upTime = new Date();
            message.sender = owner._id;
            if (message.message.camVisit.shaduleDate > (new Date())) {
                return message.save()
                    .then(result => {
                        io.getIO().in(visiter.toString()).emit('new_msg', {
                            msg: result
                        });
                        io.getIO().in(owner._id.toString()).emit('new_msg', {
                            msg: result
                        });
                        sendNotification([visiter],
                            owner.firstName + " " + owner.lastName + " is scheduled your visit on NESTSCOUT",
                            result.message.text,
                            req.protocol + '://' + req.get('host') + "/conversations/chat-box/" + owner._id,
                            owner.user_thumbnail.small
                        )
                        const timeToVisitStart = (new Date(result.message.camVisit.shaduleDate)) - (new Date());
                        setTimeout(() => {
                            startVisit(result, req);
                        }, timeToVisitStart + 300);
                        return res.status(200).send({
                            statusCode: 200,
                            message: "message sended succesfully"
                        });
                    });
            } else {
                return res.status(404).send({
                    statusCode: 404,
                    message: "visit not scheduled, add future date, invalide sheduled date",
                })
            }

        })
        .catch(err => {
            console.log(err);
            return res.status(404).send({
                statusCode: 404,
                message: "visit not scheduled",
            })
        })

}


const startVisit = (message, req) => {
    console.log(message._id);
    Message.findById(mongoose.Types.ObjectId(message._id))
        .then(message => {
            if (message.message.camVisit.shaduleDate <= (new Date())) {
                message.message.camVisit.status = 'started';
                message.upTime = new Date();
                return message.save();
            }
            return message;
        })
        .then(result => {
            io.getIO().in(result.users[0].user.toString()).emit('new_msg', {
                msg: result
            });
            io.getIO().in(result.users[1].user.toString()).emit('new_msg', {
                msg: result
            });
            sendNotification([result.users[0].user, result.users[1].user],
                " your visit has been started on NESTSCOUT",
                result.message.text,
                req.protocol + '://' + req.get('host') + "/conversations/join-visit/" + result._id,
                req.protocol + '://' + req.get('host') + "/logo.png"
            );
            setTimeout(() => {
                endVisit(message, req)
            }, 3600000);

        })
        .catch(err => console.log(err))
}

const endVisit = (message, req) => {
    console.log(message._id);
    Message.findById(mongoose.Types.ObjectId(message._id))
        .then(message => {
            if (message.message.camVisit.shaduleDate <= (new Date())) {
                message.message.camVisit.status = 'ended';
                message.upTime = new Date();
                return message.save();
            }
            return message;
        })
        .then(result => {
            io.getIO().in(result.users[0].user.toString()).emit('new_msg', {
                msg: result
            });
            io.getIO().in(result.users[1].user.toString()).emit('new_msg', {
                msg: result
            });
            sendNotification([result.users[0].user, result.users[1].user],
                " your visit has been ended on NESTSCOUT",
                result.message.text,
                req.protocol + '://' + req.get('host') + "/",
                req.protocol + '://' + req.get('host') + "/logo.png"
            )
        })
        .catch(err => console.log(err))
}
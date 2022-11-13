const Message = require("../models/message");
const Property = require("../models/property");
const User = require("../models/user");
const io = require('../socket');
const mongoose = require('mongoose');
const {
    sendNotification
} = require("../utils/firebase-helper");

exports.getConversation = (req, res, next) => {

    console.log(res.locals.user._id);
    Message.find({
            users: {
                "$in": [res.locals.user._id]
            }
        })
        .distinct('users')
        .then(result => {
            console.log(result);
        })
        .catch(err => {
            console.log(err);
        })

    res.render("conversation/conversation", {
        pageTitle: "conversation",
        path: '/conversations',
    });
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
                            users: {
                                "$in": [res.locals.user._id]
                            }
                        },
                        {
                            users: {
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
                    users: [
                        res.locals.user._id,
                        currentProperty.userId._id
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
                return mes[0];
            }
        })
        .then(message => {
            console.log(message);
            res.render("conversation/chat-page", {
                pageTitle: "conversation",
                path: '/conversations',
                owner: currentProperty.userId
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

exports.getMessages = async (req, res, next) => {
    try {
        var mNum = req.query.mNum || 1;
        var user1 = req.query.user1;
        var user2 = req.query.user2;
        // console.log(mNum, user1, user2);
        totalMessage = await Message.find({
            $and: [{
                    users: {
                        "$in": [user1]
                    }
                },
                {
                    users: {
                        "$in": [user2]
                    }
                }
            ]
        }).countDocuments();
        const message = await Message.find({
                $and: [{
                        users: {
                            "$in": [user1]
                        }
                    },
                    {
                        users: {
                            "$in": [user2]
                        }
                    }
                ]
            })
            .sort({
                updatedAt: -1
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
        users: [
            sender, reciver
        ],
        sender: sender
    });
    message.save()
        .then(result => {
            io.getIO().in(reciver.toString()).emit('new_msg', {
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
        .then(err => {
            console.log(err);
            const error = new Error("server side error");
            error.statusCode = 500;
            error.discription = "we are working on this issues"
            next(error);
        })

}
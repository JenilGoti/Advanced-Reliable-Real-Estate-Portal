const Property = require("../models/property");
var mongoose = require('mongoose');


exports.getProperty = async (req, res, next) => {
    const ITEM_PER_PAGE = 1;
    const page = req.params["page"] || 1
    try {
        console.log(req.params);
        const pageNo = req.params["pageno"];
        const totalProperty = await Property.find().countDocuments()
        const propertys = await Property.find()
            .sort({
                createdAt: -1
            })
            .skip((page - 1) * ITEM_PER_PAGE)
            .limit(ITEM_PER_PAGE)
            .select(`basicDetail.noOfBhkOrRk basicDetail.bhkOrRk basicDetail.propertyType priceArea.price priceArea.coveredArea basicDetail.city basicDetail.state photos.imageUrl`)
            .populate({
                path: "userId",
                select: "user_thumbnail.small firstName lastName"
            })

        return res.status(200).send({
            statusCode: 200,
            message: "data sended succesfully",
            propertys: propertys,
            totalPage: totalProperty,
            isAuth: res.locals.isAuthenticated,
            hasNext: page < totalProperty
        });
    } catch (err) {
        console.log(err);
        return res.status(404).send({
            statusCode: 404,
            message: "property not found",

        })
    }
}

exports.getBookmark = (req, res, next) => {
    const propId = new mongoose.Types.ObjectId(req.params["id"]);
    for (var i = 0; i < res.locals.user.bookMarks.length; i++) {
        bookmark = res.locals.user.bookMarks[i];
        if (bookmark.property.toString() == propId.toString()) {
            return res.status(200).send({
                statusCode: 200,
                message: "bookmark succesfully",
                bookmark: true
            })
        }
    }
    return res.status(200).send({
        statusCode: 200,
        message: "bookmark succesfully",
        bookmark: false
    })
}

exports.postBookmark = (req, res, next) => {
    const propId = new mongoose.Types.ObjectId(req.params["id"]);
    bookmark = req.body.bookmark;
    if (bookmark == "true") {
        res.locals.user.bookMarks = res.locals.user.bookMarks.filter((bookmark) => {
            return (bookmark.property.toString() != propId.toString());
        });
    } else {
        res.locals.user.bookMarks.push({
            property: propId
        });
    }
    res.locals.user.save()
        .then(result => {
            return res.status(200).send({
                statusCode: 200,
                message: "bookmark succesfully",
                bookmark: bookmark != "true"
            })
        })
        .catch(err => {
            return res.status(400).send({
                statusCode: 400,
                message: "bookmark error"
            })
        })
}


exports.getLike = (req, res, next) => {
    const propId = new mongoose.Types.ObjectId(req.params["id"]);
    for (var i = 0; i < res.locals.user.liked.length; i++) {
        liked = res.locals.user.liked[i];
        if (liked.property.toString() == propId.toString()) {
            return res.status(200).send({
                statusCode: 200,
                message: "like succesfully",
                like: true
            })
        }
    }
    return res.status(200).send({
        statusCode: 200,
        message: "like succesfully",
        like: false
    })
}


exports.postLike = (req, res, next) => {
    const propId = new mongoose.Types.ObjectId(req.params["id"]);
    liked = req.body.like;
    if (liked == "true") {
        res.locals.user.liked = res.locals.user.liked.filter((liked) => {
            return (liked.property.toString() != propId.toString());
        });
    } else {
        res.locals.user.liked.push({
            property: propId
        });
    }
    res.locals.user.save()
        .then(result => {
            return Property.findById(propId)
                .select("likes");
        })
        .then(property => {
            if (liked == "true") {
                property.likes = property.likes.filter((user) => {
                    return (user.toString() != res.locals.user._id.toString());
                });
            } else {
                property.likes.push(res.locals.user._id);
            }

            return property.save()
        })
        .then(result => {
            if (result) {
                return res.status(200).send({
                    statusCode: 200,
                    message: "liked succesfully",
                    like: liked != "true"
                })
            } else {
                return res.status(400).send({
                    statusCode: 400,
                    message: "liked error"
                })
            }
        })
        .catch(err => {
            return res.status(400).send({
                statusCode: 400,
                message: "liked error"
            })
        })
}
const Property = require("../models/property");
var mongoose = require('mongoose');


exports.getPropertys = async (req, res, next) => {
    const page = req.query.page || 1
    var mQurery = {}
    if (req.query.rent == "true") {
        mQurery = {
            actionType: {
                $in: ["Rent", 'PG']
            }
        }
    }
    if (req.query.sale == "true") {
        mQurery = {
            actionType: "Sale"
        }
    }

    const ITEM_PER_PAGE = 1;
    try {
        const totalProperty = await Property.find(mQurery).countDocuments()
        const propertys = await Property.find(mQurery)
            .sort({
                createdAt: -1
            })
            .skip((page - 1) * ITEM_PER_PAGE)
            .limit(ITEM_PER_PAGE)
            .select(`actionType basicDetail.noOfBhkOrRk basicDetail.bhkOrRk basicDetail.propertyType priceArea.price priceArea.coveredArea basicDetail.city basicDetail.state photos.imageUrl`)
            .populate({
                path: "userId",
                select: "user_thumbnail.small firstName lastName"
            })
        if (propertys.length > 0) {
            return res.status(200).send({
                statusCode: 200,
                message: "data sended succesfully",
                propertys: propertys,
                totalPage: totalProperty,
                isAuth: res.locals.isAuthenticated,
                hasNext: page < totalProperty
            });
        }
        throw new Error("data not found")


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

exports.getProperty = (req, res, next) => {
    const propId = req.params["propId"];

    Property.findById(mongoose.Types.ObjectId(propId))
        .populate({
            path: "likes",
            select: "user_thumbnail.small firstName lastName"
        })
        .populate({
            path: "userId",
            select: "user_thumbnail.small firstName lastName"
        })
        .then(property => {
            // console.log(property);
            res.render("property", {
                pageTitle: property.basicDetail.propertyType,
                path: "",
                property: property,
                isOwner: res.locals.user._id ? property.userId._id.toString() == res.locals.user._id.toString() : false
            })
        })
        .catch(err => {
            console.log(err);
            const error = new Error("Data not found");
            error.statusCode = 404;
            error.discription = "Data not found"
            next(error);
        })

}
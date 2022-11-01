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
    for (var i = 0; i<res.locals.user.bookMarks.length; i++) {
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

exports.postLike = (req, res, next) => {


}
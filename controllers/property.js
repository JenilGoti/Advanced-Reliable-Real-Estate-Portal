const Property = require("../models/property");

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
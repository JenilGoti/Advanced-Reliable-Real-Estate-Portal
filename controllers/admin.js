const {
    default: mongoose
} = require("mongoose");
const Property = require("../models/property");
const {
    multerMultipaleFile,
    uploadFile,
    deleteFile
} = require("../utils/firebase-helper")


exports.getAdmin = (req, res, next) => {
    res.render("admin/admin", {
        pageTitle: "Admin",
        path: "/admin/",
    });
}


exports.getAddNewProperty = (req, res, next) => {
    res.render("admin/add-property", {
        pageTitle: "Add property",
        path: "/admin/add-property",
        error: {},
        oldInput: {}
    })
}

exports.postAddNewProperty = async (req, res, next) => {
    const actionType = req.body.actionType;
    const propertyType = req.body.propertyType;
    const contry = req.body.contry;
    const state = req.body.state;
    const city = req.body.city;
    const locality = req.body.locality;
    const coordinates = {
        latitude: req.body.locationLat,
        longitude: req.body.locationLon
    }
    const society = req.body.society;
    const address = req.body.address;
    const bhkOrRk = req.body.bhkOrRk;
    const noOfBhkOrRk = req.body.noOfBhkOrRk;
    const coveredArea = req.body.coveredArea;
    const plotArea = req.body.plotArea;
    const price = req.body.price;
    const priceNegotiable = req.body.priceNegotiable;
    const furnished = req.body.furnished;
    const ageOfProperty = req.body.ageOfProperty;
    const facing = req.body.facing;
    const floorNo = req.body.floorNo;
    const totalFloors = req.body.totalFloors;
    const transactionalType = req.body.transactionalType;
    const propertyOwnership = req.body.propertyOwnership;
    const propertyAvailabity = req.body.propertyAvailabity;
    const briefDescription = req.body.briefDescription;
    const user = res.locals.user;

    const property = new Property({
        actionType: actionType,
        basicDetail: {
            coordinates: coordinates,
            propertyType: propertyType,
            contry: contry,
            state: state,
            city: city,
            locality: locality,
            society: society,
            address: address,
            bhkOrRk: bhkOrRk,
            noOfBhkOrRk: noOfBhkOrRk
        },
        priceArea: {
            coveredArea: coveredArea,
            plotArea: plotArea,
            price: price,
            priceNegotiable: priceNegotiable == "yes",
        },
        additionalDetail: {
            furnished: furnished,
            ageOfProperty: ageOfProperty,
            facing: facing,
            floorNo: floorNo,
            totalFloors: totalFloors,
            transactionalType: transactionalType,
            propertyOwnership: propertyOwnership,
            propertyAvailabity: new Date(propertyAvailabity),
        },
        otherDetail: {
            briefDescription: briefDescription
        },
        userId: user,
        agentId: (user.user_type === "Agent" ? user : user.hiredAgent)
    })
    for (var i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const filePath = "/users/" + res.locals.user._id + "/" + property._id + '/';
        const fileName = property._id + "_image(" + i + ")" + ".jpeg";
        const fileUrl = await uploadFile(file, filePath, fileName);
        property.photos = [...property.photos, {
            imageUrl: fileUrl[0],
            name: filePath + fileName
        }]
    }

    property.save()
        .then(result => {
            user.propertys = [...user.propertys, {
                property: result
            }];
            return user.save()
        })
        .then(result => {
            res.redirect('/admin');
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.statusCode = 400;
            error.discription = "your property can not uploaded"
            next(error);
        })
}


exports.getEditProperty = (req, res, next) => {
    propId = req.params["propId"];
    console.log(propId);
    Property.findById(mongoose.Types.ObjectId(propId))
        .then(property => {
            property.additionalDetail.propertyAvailabity = property.additionalDetail.propertyAvailabity.toLocaleDateString('en-CA').substring(0, 10);
            console.log(property.additionalDetail.propertyAvailabity);
            res.render("admin/edit-property", {
                pageTitle: "Edit property",
                path: "/admin/edit-property",
                property: property
            });
        })
        .catch(err => {
            console.log(err);
            const error = new Error("property not found");
            error.statusCode = 404;
            error.discription = "this property not found"
            next(error);
        })
}


exports.postEditProperty = async (req, res, next) => {
    const propId = req.body.propId;
    const actionType = req.body.actionType;
    const propertyType = req.body.propertyType;
    const contry = req.body.contry;
    const state = req.body.state;
    const city = req.body.city;
    const locality = req.body.locality;
    const coordinates = {
        latitude: req.body.locationLat,
        longitude: req.body.locationLon
    }
    const society = req.body.society;
    const address = req.body.address;
    const bhkOrRk = req.body.bhkOrRk;
    const noOfBhkOrRk = parseInt(req.body.noOfBhkOrRk);
    const coveredArea = req.body.coveredArea;
    const plotArea = req.body.plotArea;
    const price = req.body.price;
    const priceNegotiable = req.body.priceNegotiable;
    const furnished = req.body.furnished;
    const ageOfProperty = req.body.ageOfProperty;
    const facing = req.body.facing;
    const floorNo = req.body.floorNo;
    const totalFloors = req.body.totalFloors;
    const transactionalType = req.body.transactionalType;
    const propertyOwnership = req.body.propertyOwnership;
    const propertyAvailabity = req.body.propertyAvailabity;
    const briefDescription = req.body.briefDescription;
    const user = res.locals.user;

    Property.findById(propId)
        .then(property => {
            property.actionType = actionType,
                property.basicDetail = {
                    coordinates: coordinates,
                    propertyType: propertyType,
                    contry: contry,
                    state: state,
                    city: city,
                    locality: locality,
                    society: society,
                    address: address,
                    bhkOrRk: bhkOrRk,
                    noOfBhkOrRk: noOfBhkOrRk
                }
            property.priceArea = {
                coveredArea: coveredArea,
                plotArea: plotArea,
                price: price,
                priceNegotiable: priceNegotiable == "yes",
            }
            property.additionalDetail = {
                furnished: furnished,
                ageOfProperty: ageOfProperty,
                facing: facing,
                floorNo: floorNo,
                totalFloors: totalFloors,
                transactionalType: transactionalType,
                propertyOwnership: propertyOwnership,
                propertyAvailabity: new Date(propertyAvailabity),
            }
            property.otherDetail = {
                briefDescription: briefDescription
            }
            if (req.files.length > 0) {
                property.photos = [];
                for (var i = 0; i < req.files.length; i++) {
                    const file = req.files[i];
                    const filePath = "/users/" + res.locals.user._id + "/" + property._id + '/';
                    const fileName = property._id + "_image(" + i + ")" + ".jpeg";
                    uploadFile(file, filePath, fileName)
                        .then(fileUrl => {
                            property.photos = [...property.photos, {
                                imageUrl: fileUrl[0],
                                name: filePath + fileName
                            }]
                        })

                }
            }
            property.save()

        })
        .then(result => {
            res.redirect('/admin');
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.statusCode = 400;
            error.discription = "your property can not uploaded"
            next(error);
        })
}


exports.deletProperty = (req, res, next) => {
    const propId = req.body.propId;
    Property.findById(propId)
        .select("userId agentId")
        .then(property => {
            if (property.userId.toString() != res.locals.user._id.toString()) {
                console.log(err);
                res.status(403).send({
                    statusCode: 403,
                    message: "Users does not have permission",
                })
            }
            return Property.findOneAndRemove({
                _id: propId
            })
        })
        .then(result => {
            if (result) {
                res.locals.user.propertys = res.locals.user.propertys.filter(property => {
                    return (property.property.toString() != propId.toString());
                })
                deleteFile(res.locals.user._id.toString() + "/" + propId.toString());
                return res.locals.user.save();
            }
        })
        .then(result => {
            res.status(200).send({
                statusCode: 200,
                message: "property deleted successfully",
            })
        })
        .catch(err => {
            console.log(err);

        })

}



exports.getBookMarks = (req, res, next) => {
    const bookmarks = res.locals.user.bookMarks;
    res.render('admin/bookmarks', {
        pageTitle: 'Bookmarks',
        path: '/admin/bookmark',
        bookmarks: bookmarks
    })
}
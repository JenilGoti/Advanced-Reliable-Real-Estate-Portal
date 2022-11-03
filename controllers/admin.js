const Property = require("../models/property");
const {
    multerMultipaleFile,
    uploadFile
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
            res.redirect('/');
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

}



exports.getBookMarks = (req, res, next) => {
    const bookmarks = res.locals.user.bookMarks;
    res.render('admin/bookmarks', {
        pageTitle: 'Bookmarks',
        path: '/admin/bookmark',
        bookmarks: bookmarks
    })
}
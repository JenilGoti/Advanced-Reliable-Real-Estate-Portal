const mongoose = require('mongoose');
const user = require('./user');

const Schema = mongoose.Schema;

const propertySchema = new Schema({
    actionType: {
        type: String,
        enum: ['Sale', 'Rent', 'PG'],
        required: true
    },
    propertyType: {
        type: String,
        required: true
    },
    coordinates: {
        latitude: {
            type: String,
            required: true
        },
        longitude: {
            type: String,
            required: true
        }
    },
    city: {
        type: String,
        required: true
    },
    locality: {
        type: String,
        required: true
    },
    society: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    bhkOrRk: {
        type: Number,
        required: true
    },
    bathrooms: {
        type: Number,
        required: true
    },
    coveredArea: {
        type: mongoose.Types.Decimal128,
        required: true
    },
    plotArea: {
        type: mongoose.Types.Decimal128,
        required: true
    },
    price: {
        type: mongoose.Types.Decimal128,
        required: true
    },
    priceNegotiable: {
        typr: Boolean,
        required: true
    },
    furnished: {
        type: String,
        enum: ['Furnished', 'Semi-Furnished', 'Unfurnushed'],
        required: true
    },
    ageOfProperty: {
        type: Number,
        required: true
    },
    facing: {
        typr: String,
        enum: ['East', 'North', 'North-East', 'North-West', 'South', 'South-East', 'South-Wedt', 'Weat'],
        required: true
    },
    totalFloors: {
        type: Number,
        required: true
    },
    transactionalType: {
        type: String,
        enum: ['New Property', 'Resale Property'],
        required: true
    },
    propertyOwnership: {
        type: String,
        enum: ['Builder', 'Individually Owned', 'Jointly Owned', 'Co-operative Housing Society', 'Other'],
        required: true
    },
    propertyAvailabity: {
        type: Date,
        default: Date.now
    },
    briefDescriptionL: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    agentId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('property', propertySchema);
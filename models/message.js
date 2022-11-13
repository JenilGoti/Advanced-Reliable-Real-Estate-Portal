const mongoose = require('mongoose');
const User = require('./user');

const Schema = mongoose.Schema;

const messageSchema = new Schema({
    message: {
        mType: {
            type: String,
            enum: ['text', 'property', 'cam-visit']
        },
        text: {
            type: String,
            required: true
        },
        property: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Property',
        },
        camVisit: {
            type: mongoose.Schema.Types.ObjectId,
            // ref: 'Property',
        }
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    read: {
        type: Date
    },
    recived: {
        type: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('message', messageSchema);
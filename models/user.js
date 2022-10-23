const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    user_thumbnail:{
        small:{
            type:String,
            default:"/user-s-thumbnail.png"
        },
        middium:{
            type:String,
            default:"/user-s-thumbnail.png"
        },
        large:{
            type:String,
            default:"/user-s-thumbnail.png"
        }
    },
    user_email: {
        email: {
            type: String,
            required: true
        },
        new_mail:String,
        verification_status: {
            type: Boolean,
            default:false
        },
        resetToken: String,
        resetTokenExpiration: Date,
    },
    user_phone_no: {
        number: {
            type: String,
        },
        verification_status: {
            type: Boolean,
            default:false
        },
        resetToken: Number,
        resetTokenExpiration: Date,
    },
    password: {
        type: String,
        required: true
    },

});

module.exports = mongoose.model('User', userSchema);
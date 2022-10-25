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
            type: Number,
        },
        new_number:{
            type:Number
        },
        verification_status: {
            type: Boolean,
            default:false
        },
        OTP: String,
        OTPExpiration: Date,
    },
    user_address: {
        address: {
            type: Number,
        },
        new_address:{
            type:Number
        },
    },
    password: {
        type: String,
        required: true
    },

});

module.exports = mongoose.model('User', userSchema);
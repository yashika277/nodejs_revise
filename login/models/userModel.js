const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    otp: {
        type: String
    },
    otpExpiry: {
        type: Date
    },
    isOtpVerified: {
        type: Boolean,
        default: false
    },
    image:{
        type:String
    }
},{ timestamps: true })

module.exports = mongoose.model("User", userSchema)
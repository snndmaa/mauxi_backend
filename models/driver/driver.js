const mongoose = require('mongoose')

const driverSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phoneNumber: {
        type: String,
    },
    password: {
        type: String,
        required: true,
        unique: true,
        default: null,
    },
    numberVerified: {
        type: Boolean,
        default: false,
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
    profileVerified: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    dateJoined: {
        type: Date,
        default: Date.now,
    }
})

driverSchema.virtual('id').get(function (){
    return this._id.toHexString()
})

driverSchema.set('toJSON', {
    virtuals: true
})

exports.Driver = mongoose.model('Driver', driverSchema)
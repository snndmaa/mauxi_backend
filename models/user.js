const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        unique: true,
    },
    lastName: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phoneNumber: {
        type: String,
        default: null,
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
    isActive: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
})

userSchema.virtual('id').get(function (){
    return this._id.toHexString()
})

userSchema.set('toJSON', {
    virtuals: true
})

exports.User = mongoose.model('User', userSchema)
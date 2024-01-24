const mongoose = require('mongoose')

const ratingSchema = new mongoose.Schema({
    ride: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ride',
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
        required: true,
    },
    value: {
        type: Number,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,    }
})

ratingSchema.virtual('id').get(function (){
    return this._id.toHexString()
})

ratingSchema.set('toJSON', {
    virtuals: true
})

exports.Rating = mongoose.model('DriverRating', ratingSchema)
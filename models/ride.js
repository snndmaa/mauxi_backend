const mongoose = require('mongoose')

const rideSchema = new mongoose.Schema({
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    origin: {
        type: String,
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
    distance: {
        type: Number,
        required: false,
    },
    price: {
        type: Number,
        required: true,
    },
    time: {
        type: Date,
        default: Date.now,
    }
})

rideSchema.virtual('id').get(function (){
    return this._id.toHexString()
})

rideSchema.set('toJSON', {
    virtuals: true
})

exports.Ride = mongoode.model('RideRating', rideSchema)
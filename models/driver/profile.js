const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema({
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
        required: true,
    },
    picture: {
        type: Buffer,
        required: true,
    },
    carModel: {
        type: String,
        required: true,
    },
    licensePlate: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: false,
    },
})

profileSchema.virtual('id').get(function (){
    return this._id.toHexString()
})

profileSchema.set('toJSON', {
    virtuals: true
})

exports.Profile = mongoose.model('DriverProfile', profileSchema)
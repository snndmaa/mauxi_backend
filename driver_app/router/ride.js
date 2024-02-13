const express = require('express')

const { Ride }   = require('../../models/ride')
const { Driver } = require('../../models/driver/driver')


class RideRoutes {
    constructor (){
        this.router = express.Router()
        
        this.setupRoutes()
    }
    
    setupRoutes () {
        this.router.post('/add', this.addRide)
        this.router.put('/update', this.updateRide)
    }
    
    async addRide (req, res, next) {
        try {
            const { driver, user, origin, destination, distance, price } = req.body
            if (!(driver && user && origin && destination && distance && price)) throw {name: 'MissingFields'}
            
            let ride = new Ride({
                driver,
                user,
                origin, 
                destination,
                distance,
                price, 
            })
            
            ride = await ride.save()
            
            return res.send({
                ride,
                status: 'success'
            })
        }
        catch (error) {

            if (error.name === 'MongoServerError') {
                throw 'DuplicateError'
            }
            next(error)
        }
    }

    async updateRide () {
        try {

        } catch (error) {
            
        }
    }
}

module.exports = new RideRoutes()
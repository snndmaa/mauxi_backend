const express = require('express')

const { Rating } = require('../../models/driver/rating')


class RatingRoutes {
    constructor () {
        this.router = express.Router()

        this.setupRoutes()
    }

    setupRoutes () {
        this.router.get('/:id', this.getRatings)
        this.router.post('/:id', this.addRating)
    }

    async getRatings (req, res, next) {
        try{
            const rating = await Rating.find({driver: req.params.id})
            
            if (!rating) throw 'NotFound'

            res.status(200).send(rating)
        } catch (e) {
            next(e)
        }
    }
    
    addRating (req, res, next) {
        try {
            const { ride, user, driver, value, comment, date } = req.body
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new RatingRoutes()
const express = require('express')
const textflow = require('textflow.js')

const { User } = require('../../models/driver')


class UserRoutes {
    constructor() {
        this.router = express.Router()

        this.setupRoutes()
    }
    
    setupRoutes() {
        this.router.put('/:id/phone', this.addNumber)

    }

    async addNumber (req, res, next) {
        const userId = req.params.id
        const phoneNumber = req.body.phoneNumber
        
        textflow.useKey(process.env.TEXTFLOW_API_KEY)
        
        try {
            const user = await User.findByIdAndUpdate(userId, { phoneNumber }, { new: true })
            
            if (!user){
                next({
                    code: 'JGU404',
                    message: 'This user does not exist.',
                    status: 404
                })
            }
            
            try{
                const verificationOptions = {
                    "service_name": "JobGo",
                    "seconds": 200
                }

                textflow.sendVerificationSMS(phoneNumber, verificationOptions)
            }
            catch (error) {
                throw ({
                    code: 'TF0400',
                    message: 'Failed to send verification text.',
                    status: 400
                })
            }
            return res.status(202).send({
                status: 'success',
                user
            })
        }
        catch (error) {
            next({
                    code: 'JGU400',
                    message: 'Failed to update user.',
                    status: 400
                })
        }
    }

}

module.exports = new UserRoutes()
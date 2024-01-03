const express = require('express')
const bcrypt   = require('bcrypt')
const textflow = require('textflow.js')
const jwt      = require('jsonwebtoken')

const { Driver } = require('../../models/driver')


class AuthRoutes {
    constructor (){
        this.router = express.Router()
        
        this.setupRoutes()
    }
    
    setupRoutes () {
        this.router.post('/register', this.register)
        this.router.post('/sms', this.sendSMS)
        this.router.post('/verify', this.numberVerify)
        this.router.post('/login', this.login)
    }
    
    async register (req, res, next) {
        try {
            if (!(req.body.email && req.body.password)) throw {name: 'MissingFields'}
            let driver = new Driver({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                phoneNumber: req.body.phoneNumber,
                password: bcrypt.hashSync(req.body.password, 10),
            })
            
            driver = await driver.save()
            
            return res.send({
                driver,
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

    async sendSMS (req, res, next) {
        const phoneNumber = req.body.phoneNumber
 
        try{
            textflow.useKey(process.env.TEXTFLOW_API_KEY)
            const verificationOptions = {
                'service_name': 'Mauxi',
                seconds: 200,
            }

            const response = await textflow.sendVerificationSMS(phoneNumber, verificationOptions)
            
            if (response.ok) res.send({status: 'success'})
            else throw 'SMSFail'
        }
        catch (error) {
            next(error)
        }
    }
    
    async numberVerify (req, res, next) {
        try {
            const { phoneNumber, code } = req.body
            
            textflow.useKey(process.env.TEXTFLOW_API_KEY)

            if(phoneNumber) {
                const result = await textflow.verifyCode(phoneNumber, code)
                if (result.valid) {   
                    return res.send({
                        result,
                        status: 'success'
                    })
                } else {
                    throw 'NumVerifyError'
                }
            } else {
                throw 'MissingFields'
            }
        }
        catch (error) {
            next(error)
        }
    }
    

    async login (req, res, next) {

        const secret  = process.env.SECRET

        try {
            const { phoneNumber, email, password } = req.body

            if (phoneNumber) {
            const driver    = await Driver.findOne({phoneNumber})
            
                if (!user) {
                    throw 'NotFound'
                } else if(bcrypt.compareSync(req.body.password, driver.password)){
                    const token = jwt.sign(
                        {
                            DriverID: driver.id,
                            isAdmin: user.isAdmin
                        },
                        secret
                    )

                    res.send({driver: driver.email, token: token})
                }
                else{
                    throw 'ValidationError'
             }

            } else if (email) {
                const driver    = await Driver.findOne({email: email})
            
                if (!driver) {
                    throw 'NotFound'
                } else if(bcrypt.compareSync(req.body.password, driver.password)){
                    const token = jwt.sign(
                        {
                            driverID: driver.id,
                            isAdmin: driver.isAdmin
                        },
                        secret
                    )

                    res.send({driver: driver.id, token: token})
                }
                else{
                    throw 'ValidationError'
            }}
            else {
                throw 'MissingFields'
            }
        }

        catch (error) {
            next(error)
        }
    }
}

module.exports = new AuthRoutes()
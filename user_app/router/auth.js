const express = require('express')
const bcrypt   = require('bcrypt')
const textflow = require('textflow.js')
const jwt      = require('jsonwebtoken')

const { User } = require('../../models/user/user')


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
            const { firstName, lastName, email, phoneNumber, password } = req.body
            if (!(firstName, lastName, email && password && phoneNumber)) throw {name: 'MissingFields'}
            
            // if (await User.find({email})) {
            //     throw 'DuplicateError'
            // }
            let user = new User({
                firstName,
                lastName,
                email,
                phoneNumber,
                password: bcrypt.hashSync(req.body.password, 10),})        
            user = await user.save()
            
            return res.send({
                user,
                status: 'success'
            })
        }
        catch (error) {

            // if (error.name === 'MongoServerError') {
            //     throw 'DuplicateError'
            // }
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
            const user    = await User.findOne({phoneNumber})
            
                if (!user) {
                    throw 'NotFound'
                } else if(bcrypt.compareSync(req.body.password, user.password)){
                    const token = jwt.sign(
                        {
                            userID: user.id,
                            isAdmin: user.isAdmin
                        },
                        secret
                    )

                    res.send({user: user.email, token: token})
                }
                else{
                    throw 'ValidationError'
             }

            } else if (email) {
                const user    = await User.findOne({email: email})
                
                if (!user) {    
                    throw 'NotFound'
                } else if(bcrypt.compareSync(req.body.password, user.password)){
                    const token = jwt.sign(
                        {
                            userID: user.id,
                            isAdmin: user.isAdmin
                        },
                        secret
                    )

                    res.send({user: user.id, token: token})
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
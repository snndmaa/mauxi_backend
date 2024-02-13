const { expressjwt } = require('express-jwt')

const authHandle = () => {
    const secret  = process.env.SECRET
    const URLBase = process.env.URL_BASE

    return expressjwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
            '/',
            `${URLBase}/driver/auth/register`,
            `${URLBase}/driver/auth/sms`,
            `${URLBase}/driver/auth/verify`,
            `${URLBase}/driver/auth/login`,
            new RegExp(`${URLBase}/driver//auth/verify`),
            new RegExp(`${URLBase}/users/[a-zA-Z0-9]+/phone`),
            `${URLBase}/user/auth/register`,
            `${URLBase}/user/auth/login`,
            `${URLBase}/user/auth/sms`,
            `${URLBase}/user/auth/verify`,
        ]
    })
}

const isRevoked = (req, token) => {

    if (token.payload.isAdmin) return true
    return false 
}

module.exports = authHandle
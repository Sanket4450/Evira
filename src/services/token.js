const jwt = require('jsonwebtoken')

generateToken = ({ payload, secret, options }) => {
    return jwt.sign(payload, secret, options)
}

generateAuthTokens = async (userId, role = 1) => {
    const payload = {
        sub: userId,
        role
    }
    const accessToken = generateToken({
        payload,
        secret: config.ACCESS_TOKEN_SECRET,
        options: { expiresIn: config.ACCESS_TOKEN_EXPIRY }
    })
    const refreshToken = generateToken({
        payload,
        secret: config.REFRESH_TOKEN_SECRET,
        options: { expiresIn: config.REFRESH_TOKEN_EXPIRY }
    })

    return {
        accessToken,
        refreshToken
    }
}

module.exports = {
    generateAuthTokens
}
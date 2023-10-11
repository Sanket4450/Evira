const {
    tokenService
} = require('../services/index.service')

const authChecker = async (req, res, next) => {
    try {
        const token =
            req.headers && req.headers.authorization
                ? req.headers.authorization.split(' ')[1]
                : ''
        const decoded = await tokenService.verifyToken(token, config.ACCESS_TOKEN_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        Logger.error(error)
        next(error)
    }
}

module.exports = authChecker
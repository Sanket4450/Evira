const httpStatus = require('http-status')
const bcrypt = require('bcryptjs')
const userService = require('./user')
const ApiError = require('../utils/ApiError')
const constant = require('../constants')

exports.checkUserWithEmail = async (email) => {
    Logger.info('Inside checkUserWithEmail => '+ email)

    const user = await userService.getUserByEmail(email)

    if (user) {
        throw new ApiError(constant.MESSAGES.USER_ALREADY_EXISTS, httpStatus.CONFLICT)
    }
    Logger.info('User not found inside checkUserWithEmail')
    return true
}

exports.loginWithEmailAndPassword = async (email, password) => {
    Logger.info('Inside loginWithEmailAndPassword => '+ email)

    const user = await userService.getUserByEmail(email)

    if (!user) {
        throw new ApiError(constant.MESSAGES.USER_NOT_EXIST, httpStatus.NOT_FOUND)
    }
    Logger.info('User found inside loginWithEmailAndPassword')

    if (!(await bcrypt.compare(password, user.password))) {
        throw new ApiError(constant.MESSAGES.INCORRECT_PASSWROD, httpStatus.UNAUTHORIZED)
    }
    return user
}
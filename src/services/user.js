const bcrypt = require('bcryptjs')
const httpStatus = require('http-status')
const dbRepo = require('../dbRepo')
const constant = require('../constants')
const ApiError = require('../utils/ApiError')

exports.getUserByEmail = async (email) => {
    const query = {
        email
    }
    return dbRepo.findOne(constant.COLLECTIONS.USER, { query })
}

exports.createUser = async (userBody) => {
    try {
        const hashedPassword = await bcrypt.hash(userBody.password, 10)
        userBody.password = hashedPassword

        return dbRepo.create(constant.COLLECTIONS.USER, { data: userBody })
    } catch (error) {
        Logger.info('createUser error => '+ error)
        throw new ApiError(constant.MESSAGES.SOMETHING_WENT_WRONG, httpStatus.INTERNAL_SERVER_ERROR)
    }
}
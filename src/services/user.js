const bcrypt = require('bcryptjs')
const httpStatus = require('http-status')
const dbRepo = require('../dbRepo')
const constant = require('../constants')
const ApiError = require('../utils/ApiError')
const User = require('../models/user')

exports.getUserById = async (userId) => {
    const query = {
        _id: userId
    }
    return dbRepo.findOne(constant.COLLECTIONS.USER, { query })
}

exports.getUserByEmail = async (email) => {
    const query = {
        email
    }
    return dbRepo.findOne(constant.COLLECTIONS.USER, { query })
}

exports.getUserByMobile = async (mobile) => {
    const query = {
        mobile
    }
    return dbRepo.findOne(constant.COLLECTIONS.USER, { query })
}

exports.createUser = async (userBody) => {
    try {
        const hashedPassword = await bcrypt.hash(userBody.password, 10)
        userBody.password = hashedPassword

        return dbRepo.create(constant.COLLECTIONS.USER, { data: userBody })
    } catch (error) {
        Logger.info('createUser error => ' + error)
        throw new ApiError(constant.MESSAGES.SOMETHING_WENT_WRONG, httpStatus.INTERNAL_SERVER_ERROR)
    }
}

exports.updatePassword = async (userId, password) => {
    try {
        const query = {
            _id: userId
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const data = {
            password: hashedPassword
        }

        await dbRepo.updateOne(constant.COLLECTIONS.USER, { query, data })
        return true
    } catch (error) {
        Logger.info('updatePassword error => ' + error)
        throw new ApiError(constant.MESSAGES.SOMETHING_WENT_WRONG, httpStatus.INTERNAL_SERVER_ERROR)
    }
}

exports.updateUser = async (userId, userBody) => {
    try {
        Logger.info('Inside updateUser')
        const query = {
            _id: userId
        }
        const data = {
            ...userBody
        }

        if (userBody.email || userBody.mobile) {
            emailOrMobileTaken = await User.findOne({
                $and: [{ $or: [{ email: userBody.email }, { mobile: userBody.mobile }] }, { email: { $ne: userBody.email } }]
            })

            if (emailOrMobileTaken) {
                throw new ApiError(constant.MESSAGES.USER_ALREADY_EXISTS, httpStatus.CONFLICT)
            }

            // send a verification link to email & mobile
        }
        await dbRepo.updateOne(constant.COLLECTIONS.USER, { query, data })
        return true
    } catch (error) {
        Logger.info('updateUser error => ' + error)
        throw new ApiError(constant.MESSAGES.SOMETHING_WENT_WRONG, httpStatus.INTERNAL_SERVER_ERROR)
    }
}

exports.deleteUserById = async (userId) => {
    const query = {
        _id: userId
    }
    return dbRepo.deleteOne(constant.COLLECTIONS.USER, { query })
}
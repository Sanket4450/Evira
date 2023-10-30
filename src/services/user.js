const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const httpStatus = require('http-status')
const dbRepo = require('../dbRepo')
const constant = require('../constants')
const ApiError = require('../utils/ApiError')
const User = require('../models/user')

exports.getUserById = async (userId) => {

    const query = {
        _id: new mongoose.Types.ObjectId(userId)
    }

    const data = {
        _id: 1
    }

    return dbRepo.findOne(constant.COLLECTIONS.USER, { query, data })
}

exports.getUserByEmail = async (email) => {
    const query = {
        email
    }

    const data = {
        email: 1,
        password: 1
    }

    return dbRepo.findOne(constant.COLLECTIONS.USER, { query, data })
}

exports.getUserByMobile = async (mobile) => {
    const query = {
        mobile
    }

    const data = {
        _id: 1
    }

    return dbRepo.findOne(constant.COLLECTIONS.USER, { query, data })
}

exports.getFullUserById = async (userId, userData) => {
    const query = {
        _id: new mongoose.Types.ObjectId(userId)
    }

    const data = (typeof userData === 'object' && Object.keys(userData).length >= 1)
        ? { ...userData }
        : {
            fullName: 1,
            nickName: 1,
            profileImage: 1,
            dateOfBirth: 1,
            email: 1,
            mobile: 1,
            gender: 1
        }

    return dbRepo.findOne(constant.COLLECTIONS.USER, { query, data })
}

exports.createUser = async (userBody) => {
    try {
        Logger.info('Inside createUser')

        const hashedPassword = await bcrypt.hash(userBody.password, 10)
        userBody.password = hashedPassword

        return dbRepo.create(constant.COLLECTIONS.USER, { data: userBody })
    } catch (error) {
        Logger.error('createUser error => ' + error)

        throw new ApiError(constant.MESSAGES.SOMETHING_WENT_WRONG, httpStatus.INTERNAL_SERVER_ERROR)
    }
}

exports.updatePassword = async (userId, password) => {
    try {
        Logger.info('Inside updatePassword')

        const query = {
            _id: new mongoose.Types.ObjectId(userId)
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const data = {
            password: hashedPassword
        }

        await dbRepo.updateOne(constant.COLLECTIONS.USER, { query, data })
        return true
    } catch (error) {
        Logger.error('updatePassword error => ' + error)

        throw new ApiError(constant.MESSAGES.SOMETHING_WENT_WRONG, httpStatus.INTERNAL_SERVER_ERROR)
    }
}

exports.updateUser = async (userId, userBody) => {
    try {
        Logger.info('Inside updateUser')

        const query = {
            _id: new mongoose.Types.ObjectId(userId)
        }
        const data = {
            $set: {
                ...userBody
            }
        }

        if (userBody.email || userBody.mobile) {
            emailOrMobileTaken = await User.findOne({
                $or: [
                    { $and: [{ email: userBody.email }, { _id: { $ne: userId } }] },
                    { $and: [{ mobile: userBody.mobile }, { _id: { $ne: userId } }] }
                ]
            })

            if (emailOrMobileTaken) {
                throw new ApiError(constant.MESSAGES.USER_ALREADY_EXISTS, httpStatus.CONFLICT)
            }

            // send a verification link to email & mobile
        }
        await dbRepo.updateOne(constant.COLLECTIONS.USER, { query, data })

        return true
    } catch (error) {
        Logger.error('updateUser error => ' + error)

        if (error.message === constant.MESSAGES.USER_ALREADY_EXISTS) {
            throw new ApiError(constant.MESSAGES.USER_ALREADY_EXISTS, httpStatus.CONFLICT)
        }
        throw new ApiError(constant.MESSAGES.SOMETHING_WENT_WRONG, httpStatus.INTERNAL_SERVER_ERROR)
    }
}

exports.deleteUserById = async (userId) => {
    const query = {
        _id: new mongoose.Types.ObjectId(userId)
    }
    return dbRepo.deleteOne(constant.COLLECTIONS.USER, { query })
}

exports.getDefaultAddressById = (userId) => {
    const query = {
        user: new mongoose.Types.ObjectId(userId),
        default: true
    }

    const data = {
        user: 0
    }
    return dbRepo.findOne(constant.COLLECTIONS.ADDRESS, { query, data })
}

exports.getAddressById = (addressId, userId) => {
    const query = {
        _id: new mongoose.Types.ObjectId(addressId),
        user: new mongoose.Types.ObjectId(userId)
    }

    const data = {
        user: 0
    }

    return dbRepo.findOne(constant.COLLECTIONS.ADDRESS, { query, data })
}

exports.getAddresses = (userId) => {
    const query = {
        user: new mongoose.Types.ObjectId(userId)
    }

    const data = {
        user: 0
    }

    return dbRepo.find(constant.COLLECTIONS.ADDRESS, { query, data })
}

exports.createAddress = (userId, addressBody) => {
    const data = {
        user: new mongoose.Types.ObjectId(userId),
        ...addressBody
    }
    return dbRepo.create(constant.COLLECTIONS.ADDRESS, { data })
}

exports.updateAddress = (addressId, userId, addressBody) => {
    const query = {
        _id: new mongoose.Types.ObjectId(addressId),
        user: new mongoose.Types.ObjectId(userId)
    }

    const data = {
        $set: {
            ...addressBody
        }
    }

    return dbRepo.updateOne(constant.COLLECTIONS.ADDRESS, { query, data })
}

exports.deleteAddress = (addressId, userId) => {
    const query = {
        _id: new mongoose.Types.ObjectId(addressId),
        user: new mongoose.Types.ObjectId(userId)
    }
    return dbRepo.deleteOne(constant.COLLECTIONS.ADDRESS, { query })
}

exports.getUsers = (adminId, { page, limit }) => {
    page ||= 1
    limit ||= 10

    const query = {
        _id: { $ne: new mongoose.Types.ObjectId(adminId) }
    }

    return dbRepo.findPage(constant.COLLECTIONS.USER, { query }, {}, page, limit)
}

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const httpStatus = require('http-status')
const dbRepo = require('../dbRepo')
const constant = require('../constants')
const ApiError = require('../utils/ApiError')
const User = require('../models/user')

exports.getUserById = async (userId) => {
    const query = {
        _id: new mongoose.Types.ObjectId(userId),
    }

    const data = {
        _id: 1,
    }

    return dbRepo.findOne(constant.COLLECTIONS.USER, { query, data })
}

exports.getUserPasswordById = async (userId) => {
    const query = {
        _id: new mongoose.Types.ObjectId(userId),
    }

    const data = {
        password: 1,
    }

    return dbRepo.findOne(constant.COLLECTIONS.USER, { query, data })
}

exports.getUserByEmail = async (email) => {
    const query = {
        email,
    }

    const data = {
        nickName: 1,
        password: 1,
        role: 1,
        isProfileCompleted: 1,
    }

    return dbRepo.findOne(constant.COLLECTIONS.USER, { query, data })
}

exports.getFullUserById = async (userId, userData) => {
    const query = {
        _id: new mongoose.Types.ObjectId(userId),
    }

    const data =
        typeof userData === 'object' && Object.keys(userData).length >= 1
            ? { ...userData }
            : {
                  fullName: 1,
                  nickName: 1,
                  profileImage: 1,
                  dateOfBirth: 1,
                  email: 1,
                  mobile: 1,
                  gender: 1,
                  language: 1,
              }

    return dbRepo.findOne(constant.COLLECTIONS.USER, { query, data })
}

exports.getFullUserExcludingId = async (userId, userData) => {
    const query = {
        _id: new mongoose.Types.ObjectId(userId),
    }

    const data =
        typeof userData === 'object' && Object.keys(userData).length >= 1
            ? { ...userData }
            : {
                  fullName: 1,
                  nickName: 1,
                  profileImage: 1,
                  dateOfBirth: 1,
                  email: 1,
                  mobile: 1,
                  gender: 1,
                  _id: 0,
              }

    return dbRepo.findOne(constant.COLLECTIONS.USER, { query, data })
}

exports.createUser = async (userBody) => {
    try {
        Logger.info('Inside createUser')

        userBody.password = await bcrypt.hash(userBody.password, 10)
        userBody.role = userBody.role === 'admin' ? 'admin' : 'user'

        return dbRepo.create(constant.COLLECTIONS.USER, { data: userBody })
    } catch (error) {
        Logger.error(`createUser error => ${error}`)

        throw new ApiError(
            constant.MESSAGES.SOMETHING_WENT_WRONG,
            httpStatus.INTERNAL_SERVER_ERROR
        )
    }
}

exports.updatePassword = async (userId, password) => {
    try {
        Logger.info('Inside updatePassword')

        const query = {
            _id: new mongoose.Types.ObjectId(userId),
        }
        const data = {
            password: await bcrypt.hash(password, 10),
        }

        await dbRepo.updateOne(constant.COLLECTIONS.USER, { query, data })
    } catch (error) {
        Logger.error(`updatePassword error => ${error}`)

        throw new ApiError(
            constant.MESSAGES.SOMETHING_WENT_WRONG,
            httpStatus.INTERNAL_SERVER_ERROR
        )
    }
}

exports.setResetOTP = async (userId, otp) => {
    try {
        Logger.info('Inside setResetOTP')

        const query = {
            _id: new mongoose.Types.ObjectId(userId),
        }
        const data = {
            resetOTP: otp,
        }

        await dbRepo.updateOne(constant.COLLECTIONS.USER, { query, data })
    } catch (error) {
        Logger.error(`setResetOTP error => ${error}`)

        throw new ApiError(
            constant.MESSAGES.SOMETHING_WENT_WRONG,
            httpStatus.INTERNAL_SERVER_ERROR
        )
    }
}

exports.getUserWithOTP = async (userId) => {
    try {
        Logger.info('Inside getResetOTP')

        const query = {
            _id: new mongoose.Types.ObjectId(userId),
        }
        const data = {
            resetOTP: 1,
        }

        return dbRepo.findOne(constant.COLLECTIONS.USER, { query, data })
    } catch (error) {
        Logger.error(`getResetOTP error => ${error}`)

        throw new ApiError(
            constant.MESSAGES.SOMETHING_WENT_WRONG,
            httpStatus.INTERNAL_SERVER_ERROR
        )
    }
}

exports.updateUser = async (userId, userBody) => {
    try {
        Logger.info('Inside updateUser')

        const query = {
            _id: new mongoose.Types.ObjectId(userId),
        }

        if (userBody.email) {
            const emailTakenUser = await User.findOne({
                $and: [
                    { email: userBody.email },
                    {
                        _id: {
                            $ne: new mongoose.Types.ObjectId(userId),
                        },
                    },
                ],
            })

            if (emailTakenUser) {
                throw new ApiError(
                    constant.MESSAGES.USER_EXISTS_WITH_EMAIL,
                    httpStatus.CONFLICT
                )
            }
        }

        if (userBody.mobile) {
            const mobileTakenUser = await User.findOne({
                $and: [
                    { mobile: userBody.mobile },
                    {
                        _id: {
                            $ne: new mongoose.Types.ObjectId(userId),
                        },
                    },
                ],
            })

            if (mobileTakenUser) {
                throw new ApiError(
                    constant.MESSAGES.USER_EXISTS_WITH_MOBILE,
                    httpStatus.CONFLICT
                )
            }
        }

        const data = {
            $set: {
                ...userBody,
            },
        }

        await dbRepo.updateOne(constant.COLLECTIONS.USER, { query, data })
    } catch (error) {
        Logger.error(`updateUser error => ${error}`)

        throw new ApiError(
            error.message || constant.MESSAGES.SOMETHING_WENT_WRONG,
            error.statusCode || httpStatus.INTERNAL_SERVER_ERROR
        )
    }
}

exports.deleteUserById = async (userId) => {
    Logger.info('Inside deleteUserById')

    const query = {
        _id: new mongoose.Types.ObjectId(userId),
    }
    return dbRepo.deleteOne(constant.COLLECTIONS.USER, { query })
}

exports.getDefaultAddressById = (userId) => {
    const query = {
        user: new mongoose.Types.ObjectId(userId),
        default: true,
    }

    const data = {
        user: 0,
    }

    return dbRepo.findOne(constant.COLLECTIONS.ADDRESS, { query, data })
}

exports.updateDefaultAddressById = (addressId, defaultValue) => {
    const query = {
        _id: new mongoose.Types.ObjectId(addressId),
    }

    const data = {
        $set: {
            default: defaultValue,
        },
    }

    return dbRepo.updateOne(constant.COLLECTIONS.ADDRESS, { query, data })
}

exports.getAddressById = (addressId, userId) => {
    Logger.info(`Inside getAddressById => address = ${addressId}`)

    const query = {
        _id: new mongoose.Types.ObjectId(addressId),
        user: new mongoose.Types.ObjectId(userId),
    }

    const data = {
        user: 0,
    }

    return dbRepo.findOne(constant.COLLECTIONS.ADDRESS, { query, data })
}

exports.getAddresses = (userId) => {
    Logger.info('Inside getAddresses')

    const query = {
        user: new mongoose.Types.ObjectId(userId),
    }

    const data = {
        user: 0,
    }

    const sortQuery = {
        createdAt: -1
    }

    return dbRepo.find(constant.COLLECTIONS.ADDRESS, { query, data }, sortQuery)
}

exports.createAddress = async (userId, addressBody) => {
    Logger.info('Inside updateAddress')

    const defaultAddress = await exports.getDefaultAddressById(userId)

    addressBody.default === true && defaultAddress
        ? exports.updateDefaultAddressById(defaultAddress, false)
        : (!addressBody.default || addressBody.default === false) &&
          !defaultAddress
        ? (addressBody.default = true)
        : !addressBody.default && defaultAddress
        ? (addressBody.default = false)
        : null

    const data = {
        user: new mongoose.Types.ObjectId(userId),
        ...addressBody,
    }
    return dbRepo.create(constant.COLLECTIONS.ADDRESS, { data })
}

exports.updateAddress = async (addressId, userId, addressBody) => {
    Logger.info(`Inside updateAddress => address = ${addressId}`)

    if (addressBody.default === false) {
        throw new ApiError(
            constant.MESSAGES.DEFAULT_ADDRESS,
            httpStatus.CONFLICT
        )
    }

    const query = {
        _id: new mongoose.Types.ObjectId(addressId),
        user: new mongoose.Types.ObjectId(userId),
    }

    const defaultAddress = await exports.getDefaultAddressById(userId)

    addressBody.default === true && addressId !== defaultAddress
        ? exports.updateDefaultAddressById(defaultAddress, false)
        : null

    const data = {
        $set: {
            ...addressBody,
        },
    }

    return dbRepo.updateOne(constant.COLLECTIONS.ADDRESS, { query, data })
}

exports.deleteAddress = (addressId, userId) => {
    Logger.info(`Inside deleteAddress => address = ${addressId}`)

    const query = {
        _id: new mongoose.Types.ObjectId(addressId),
        user: new mongoose.Types.ObjectId(userId),
    }
    return dbRepo.deleteOne(constant.COLLECTIONS.ADDRESS, { query })
}

exports.getUsers = (adminId, { page, limit }) => {
    Logger.info(`Inside getUsers => page = ${page}, limit = ${limit}`)

    page ||= 1
    limit ||= 10

    const query = {
        _id: { $ne: new mongoose.Types.ObjectId(adminId) },
    }

    return dbRepo.findWithCount(
        constant.COLLECTIONS.USER,
        { query },
        { createdAt: -1 },
        page,
        limit
    )
}

exports.getAllUsers = () => {
    Logger.info('Inside getAllUsers')

    const query = {
        role: 'user',
    }

    const data = {
        _id: 1
    }

    const sortQuery = {
        createdAt: -1
    }

    return dbRepo.find(constant.COLLECTIONS.USER, { query, data }, sortQuery)
}

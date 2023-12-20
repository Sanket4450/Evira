const httpStatus = require('http-status')
const catchAsyncErrors = require('../utils/catchAsyncErrors')
const ApiError = require('../utils/ApiError')
const constant = require('../constants')
const sendResponse = require('../utils/responseHandler')
const toBoolean = require('../utils/checkBoolean')
const {
    userService
} = require('../services/index.service')

exports.getProfile = catchAsyncErrors(async (req, res) => {
    const user = await userService.getFullUserExcludingId(req.user.sub)

    if (!user) {
        throw new ApiError(constant.MESSAGES.USER_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    return sendResponse(
        res,
        httpStatus.OK,
        { user }
    )
})

exports.updateProfile = catchAsyncErrors(async (req, res) => {
    const body = req.body

    let user = await userService.getFullUserExcludingId(req.user.sub)

    if (!user) {
        throw new ApiError(constant.MESSAGES.USER_NOT_FOUND, httpStatus.NOT_FOUND)
    }
    
    await userService.updateUser(user._id, body)

    user = await userService.getFullUserById(user._id)

    return sendResponse(
        res,
        httpStatus.OK,
        { user },
        'Profile updated successfully'
    )
})

exports.deleteProfile = catchAsyncErrors(async (req, res) => {
    const user = await userService.getFullUserById(req.user.sub)

    if (!user) {
        throw new ApiError(constant.MESSAGES.USER_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    await userService.deleteUserById(user._id)

    return sendResponse(
        res,
        httpStatus.OK,
        {},
        'Profile deleted successfully'
    )
})

exports.toggleNotifications = catchAsyncErrors(async (req, res) => {
    const user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(constant.MESSAGES.USER_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    const enable = toBoolean(req.query.enable)

    await userService.updateUser(user._id, { isNotificationEnabled: enable })

    return sendResponse(
        res,
        httpStatus.OK,
        {},
        `Notifications ${enable ? 'enabled' : 'disabled'} successfully`
    )
})

exports.getAddresses = catchAsyncErrors(async (req, res) => {
    const user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(constant.MESSAGES.USER_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    const addresses = await userService.getAddresses(user._id)

    return sendResponse(
        res,
        httpStatus.OK,
        { addresses },
        'Addresses retrieved successfully'
    )
})

exports.postAddress = catchAsyncErrors(async (req, res) => {
    const body = req.body

    const user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(constant.MESSAGES.USER_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    const address = await userService.createAddress(user._id, body)

    return sendResponse(
        res,
        httpStatus.OK,
        { address },
        'Address created successfully'
    )
})

exports.updateAddress = catchAsyncErrors(async (req, res) => {
    const body = req.body
    const { addressId } = req.params

    const user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(constant.MESSAGES.USER_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    let address = await userService.getAddressById(addressId, user._id)

    if (!address) {
        throw new ApiError(constant.MESSAGES.ADDRESS_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    await userService.updateAddress(addressId, user._id, body)

    address = await userService.getAddressById(addressId, user._id)

    return sendResponse(
        res,
        httpStatus.OK,
        { address },
        'Address updated successfully'
    )
})

exports.deleteAddress = catchAsyncErrors(async (req, res) => {
    const { addressId } = req.params

    const user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(constant.MESSAGES.USER_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    const address = await userService.getAddressById(addressId, user._id)

    if (!address) {
        throw new ApiError(constant.MESSAGES.ADDRESS_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    await userService.deleteAddress(addressId, user._id)

    return sendResponse(
        res,
        httpStatus.OK,
        {},
        'Address deleted successfully'
    )
})

exports.getUsers = catchAsyncErrors(async (req, res) => {
    const { page, limit } = req.query

    const user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(constant.MESSAGES.ADMIN_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    const users = await userService.getUsers(user._id, { page, limit })

    return sendResponse(
        res,
        httpStatus.OK,
        { users },
        'Users retrieved successfully'
    )
})

exports.getUser = catchAsyncErrors(async (req, res) => {
    const { userId } = req.params

    if (!await userService.getUserById(req.user.sub)) {
        throw new ApiError(constant.MESSAGES.ADMIN_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    const user = await userService.getFullUserById(userId)

    return sendResponse(
        res,
        httpStatus.OK,
        { user },
        'User retrieved successfully'
    )
})

exports.updateUser = catchAsyncErrors(async (req, res) => {
    const { userId } = req.params

    if (!await userService.getUserById(req.user.sub)) {
        throw new ApiError(constant.MESSAGES.ADMIN_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    if (!await userService.getUserById(userId)) {
        throw new ApiError(constant.MESSAGES.USER_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    await userService.updateUser(userId, req.body)

    const user = await userService.getFullUserById(userId)

    return sendResponse(
        res,
        httpStatus.OK,
        { user },
        'User updated successfully'
    )
})

exports.deleteUser = catchAsyncErrors(async (req, res) => {
    const { userId } = req.params

    if (!await userService.getUserById(req.user.sub)) {
        throw new ApiError(constant.MESSAGES.ADMIN_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    const user = await userService.getFullUserById(userId)

    await userService.deleteUserById(userId)

    return sendResponse(
        res,
        httpStatus.OK,
        { user },
        'User deleted successfully'
    )
})

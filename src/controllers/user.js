const httpStatus = require('http-status')
const catchAsyncErrors = require('../utils/catchAsyncErrors')
const ApiError = require('../utils/ApiError')
const constant = require('../constants')
const sendResponse = require('../utils/responseHandler')
const {
    userService,
    notificationService,
} = require('../services/index.service')

exports.postProfile = catchAsyncErrors(async (req, res) => {
    const body = req.body

    let user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(
            constant.MESSAGES.USER_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    await userService.updateUser(user._id, {
        ...body,
        isProfileCompleted: true,
    })

    const notificationBody = {
        title: 'Account Setup!',
        message: 'Your account has been created successfully',
        icon: constant.NOTIFICATIONS.USER,
    }

    await notificationService.createNotification(user._id, notificationBody)

    user = await userService.getFullUserExcludingId(user._id)

    return sendResponse(
        res,
        httpStatus.OK,
        { user },
        'Profile created successfully'
    )
})

exports.getProfile = catchAsyncErrors(async (req, res) => {
    const user = await userService.getFullUserExcludingId(req.user.sub)

    if (!user) {
        throw new ApiError(
            constant.MESSAGES.USER_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    return sendResponse(
        res,
        httpStatus.OK,
        { user },
        'Profile retrieved successfully'
    )
})

exports.updateProfile = catchAsyncErrors(async (req, res) => {
    const body = req.body

    let user = await userService.getFullUserById(req.user.sub)

    if (!user) {
        throw new ApiError(
            constant.MESSAGES.USER_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    await userService.updateUser(user._id, body)

    const notificationBody = {
        title: 'Profile Updated!',
        message: 'Your profile has been updated successfully',
        icon: constant.NOTIFICATIONS.USER,
    }

    await notificationService.createNotification(user._id, notificationBody)

    user = await userService.getFullUserExcludingId(user._id)

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
        throw new ApiError(
            constant.MESSAGES.USER_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    await userService.deleteUserById(user._id)

    return sendResponse(res, httpStatus.OK, {}, 'Profile deleted successfully')
})

exports.toggleNotifications = catchAsyncErrors(async (req, res) => {
    const { isEnabled } = req.body

    const user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(
            constant.MESSAGES.USER_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    await userService.updateUser(user._id, { isNotificationEnabled: isEnabled })

    return sendResponse(
        res,
        httpStatus.OK,
        { isEnabled },
        `Notifications ${isEnabled ? 'enabled' : 'disabled'} successfully`
    )
})

exports.getAddresses = catchAsyncErrors(async (req, res) => {
    const user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(
            constant.MESSAGES.USER_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
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
        throw new ApiError(
            constant.MESSAGES.USER_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    const address = await userService.createAddress(user._id, body)

    const notificationBody = {
      title: 'Address Created!',
      message: 'New address created successfully',
      icon: constant.NOTIFICATIONS.LOCATION,
    }

    await notificationService.createNotification(user._id, notificationBody)

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
        throw new ApiError(
            constant.MESSAGES.USER_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    let address = await userService.getAddressById(addressId, user._id)

    if (!address) {
        throw new ApiError(
            constant.MESSAGES.ADDRESS_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    await userService.updateAddress(addressId, user._id, body)

    const notificationBody = {
      title: 'Address Updated!',
      message: 'Address updated successfully',
      icon: constant.NOTIFICATIONS.LOCATION,
    }

    await notificationService.createNotification(user._id, notificationBody)

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
        throw new ApiError(
            constant.MESSAGES.USER_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    const address = await userService.getAddressById(addressId, user._id)

    if (!address) {
        throw new ApiError(
            constant.MESSAGES.ADDRESS_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    await userService.deleteAddress(addressId, user._id)

    return sendResponse(res, httpStatus.OK, {}, 'Address deleted successfully')
})

exports.getUsers = catchAsyncErrors(async (req, res) => {
    const { page, limit } = req.query

    const user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(
            constant.MESSAGES.ADMIN_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
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

    if (!(await userService.getUserById(req.user.sub))) {
        throw new ApiError(
            constant.MESSAGES.ADMIN_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
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

    if (!(await userService.getUserById(req.user.sub))) {
        throw new ApiError(
            constant.MESSAGES.ADMIN_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    if (!(await userService.getUserById(userId))) {
        throw new ApiError(
            constant.MESSAGES.USER_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
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

    if (!(await userService.getUserById(req.user.sub))) {
        throw new ApiError(
            constant.MESSAGES.ADMIN_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
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

const mongoose = require('mongoose')
const httpStatus = require('http-status')
const bcrypt = require('bcryptjs')
const dbRepo = require('../dbRepo')
const constant = require('../constants')
const ApiError = require('../utils/ApiError')
const userService = require('./user')
const orderService = require('./order')

const getPaymentMethods = (userId) => {
    const query = {
        user: new mongoose.Types.ObjectId(userId)
    }

    const data = {
        name: 1,
        cardName: 1
    }

    return dbRepo.find(constant.COLLECTIONS.PAYMENTMETHOD, { query, data })
}

const getFullPaymentMethod = (paymentId, userId) => {
    const query = {
        _id: new mongoose.Types.ObjectId(paymentId),
        user: new mongoose.Types.ObjectId(userId)
    }

    const data = {
        _id: 0,
        user: 0
    }

    return dbRepo.findOne(constant.COLLECTIONS.PAYMENTMETHOD, { query, data })
}

const updatePaymentMethod = (paymentId, userId, data) => {
    const query = {
        _id: new mongoose.Types.ObjectId(paymentId),
        user: new mongoose.Types.ObjectId(userId)
    }

    return dbRepo.updateOne(constant.COLLECTIONS.PAYMENTMETHOD, { query, data })
}

const checkPaymentMethod = async ({ paymentId, userId, amount }) => {
    const paymentMethod = await getFullPaymentMethod(paymentId, userId)

    if (!paymentMethod) {
        throw new ApiError(constant.MESSAGES.PAYMENT_METHOD_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    if (paymentMethod.balance < amount) {
        throw new ApiError(constant.MESSAGES.INSUFFICIENT_BALANCE, httpStatus.FORBIDDEN)
    }

    if (paymentMethod.expiryDate < Date.now()) {
        throw new ApiError(constant.MESSAGES.PAYMENT_METHOD_EXPIRED, httpStatus.FORBIDDEN)
    }

    return true
}

const postPayment = async ({ userId, orderId, pin }) => {
    Logger.info(`Inside postPayment => orderId = ${orderId}`)

    if (!await userService.getUserById(userId)) {
        throw new ApiError(constant.MESSAGES.USER_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    const order = await orderService.getOrderById(orderId, userId)

    if (!order) {
        throw new ApiError(constant.MESSAGES.ORDER_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    const paymentId = order.paymentMethod.toString()

    const paymentMethod = await getFullPaymentMethod(paymentId, userId)

    if (!await bcrypt.compare(String(pin), paymentMethod.pin)) {
        throw new ApiError(constant.MESSAGES.INCORRECT_PIN, httpStatus.FORBIDDEN)
    }

    const data = {
        $inc: {
            balance: -order.amount
        }
    }

    await updatePaymentMethod(paymentId, userId, data)

    return await orderService.getOrderById(orderId, userId)
}

module.exports = {
    getPaymentMethods,
    getFullPaymentMethod,
    checkPaymentMethod,
    postPayment
}

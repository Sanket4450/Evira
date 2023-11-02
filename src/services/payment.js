const mongoose = require('mongoose')
const dbRepo = require('../dbRepo')
const constant = require('../constants')

const getPaymentMethods = (userId) => {
    Logger.info('Inside getPaymentMethods')
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
    Logger.info(`Inside getPaymentMethods => paymentMethod = ${paymentId}`)

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

module.exports = {
    getPaymentMethods,
    getFullPaymentMethod
}

const mongoose = require('mongoose')
const dbRepo = require('../dbRepo')
const constant = require('../constants')

exports.getOrderById = (orderId, userId) => {
    const query = {
        _id: new mongoose.Types.ObjectId(orderId),
        user: new mongoose.Types.ObjectId(userId)
    }
    return dbRepo.findOne(constant.COLLECTIONS.ORDER, { query })
}

exports.createOrder = (userId, orderBody) => {
    const data = {
        user: new mongoose.Types.ObjectId(userId),
        ...orderBody
    }

    return dbRepo.create(constant.COLLECTIONS.ORDER, { data })
}

exports.updateOrder = (orderId, orderBody) => {
    const query = {
        _id: new mongoose.Types.ObjectId(orderId)
    }

    const data = {
        $set: {
            ...orderBody
        }
    }

    return dbRepo.updateOne(constant.COLLECTIONS.ORDER, { query, data })
}

exports.deleteOrder = (orderId) => {
    const query = {
        _id: new mongoose.Types.ObjectId(orderId)
    }
    return dbRepo.deleteOne(constant.COLLECTIONS.ORDER, { query })
}

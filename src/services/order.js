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

exports.getOrders = (type, userId, { page, limit }) => {
    page ||= 1
    limit ||= 10

    const pipeline = [
        {
            $match: {
                user: new mongoose.Types.ObjectId(userId),
                type: { $regex: type, $options: 'i' }
            }
        },
        {
            $lookup: {
                from: 'products',
                localField: 'item.product',
                foreignField: '_id',
                as: 'product'
            }
        },
        {
            $unwind: '$product'
        },
        {
            $lookup: {
                from: 'variants',
                localField: 'item.variant',
                foreignField: '_id',
                as: 'variant'
            }
        },
        {
            $unwind: '$variant'
        },
        {
            $group: {
                _id: '$_id',
                product: { $first: '$item.product' },
                variant: { $first: '$item.variant' },
                name: { $first: '$product.name' },
                image: { $first: '$product.image' },
                color: { $first: '$variant.color' },
                size: { $first: '$variant.size' },
                quantity: { $first: '$item.quantity' },
                amount: { $first: '$amount' }
            }
        },
        {
            $project: {
                product: 1,
                variant: 1,
                name: 1,
                image: 1,
                color: 1,
                size: 1,
                quantity: 1,
                amount: 1,
                _id: 0,
                id: '$_id'
            }
        }
    ]

    return dbRepo.aggregate(constant.COLLECTIONS.ORDER, pipeline)
}

exports.getTrackOrder = (orderId, userId) => {
    const query = {
        _id: new mongoose.Types.ObjectId(orderId),
        user: new mongoose.Types.ObjectId(userId),
    }

    const data = {
        status: 1,
        _id: 0
    }

    return dbRepo.findOne(constant.COLLECTIONS.ORDER, { query, data })
}

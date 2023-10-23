const mongoose = require('mongoose')
const httpStatus = require('http-status')
const dbRepo = require('../dbRepo')
const constant = require('../constants')
const ApiError = require('../utils/ApiError')

exports.getCartProductById = (productId, userId) => {
    const query = {
        user: new mongoose.Types.ObjectId(userId),
        'items.product': { $eq: new mongoose.Types.ObjectId(productId) }
    }

    const data = {
        'items.product': 1,
        'items.quantity': 1
    }

    return dbRepo.findOne(constant.COLLECTIONS.CART, { query, data })
}

exports.cartAction = (action, productId, userId, quantity = 1) => {
    Logger.info(`Inside cartAction => action = ${action} productId = ${productId} userId = ${userId} quantity = ${quantity}`)

    const query = (action === 'add' || action === 'remove')
        ? {
            user: new mongoose.Types.ObjectId(userId),
        } : (action === 'increase' || action === 'decrease')
            ? {
                user: new mongoose.Types.ObjectId(userId),
                'items.product': new mongoose.Types.ObjectId(productId)
            } : undefined

    const data = (action === 'add')
        ? {
            $push: {
                items: {
                    product: new mongoose.Types.ObjectId(productId),
                    quantity,
                    addedAt: Date.now()
                }
            }
        } : (action === 'remove')
            ? {
                $pull: {
                    items: {
                        product: new mongoose.Types.ObjectId(productId),
                    }
                }
            } : (action === 'increase')
                ? {
                    $inc: {
                        'items.$.quantity': quantity
                    }
                } : (action === 'decrease')
                    ? {
                        $inc: {
                            'items.$.quantity': -quantity
                        }
                    } : undefined

    if (!query || !data) throw new ApiError(constant.MESSAGES.ENTER_VALID_ACTION, httpStatus.BAD_REQUEST)

    const options = {
        upsert: true
    }

    return dbRepo.updateOne(constant.COLLECTIONS.CART, { query, data, options })
}

exports.getCartProducts = (userId, { page, limit }) => {
    Logger.info(`Inside getCartProducts => page = ${page} & limit = ${limit}`)

    page ||= 1
    limit ||= 10

    const pipeline = [
        {
            $match: {
                user: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $unwind: '$items'
        },
        {
            $lookup: {
                from: 'products',
                localField: 'items.product',
                foreignField: '_id',
                as: 'products'
            }
        },
        {
            $unwind: '$products'
        },
        {
            $group: {
                _id: '$products._id',
                name: { $first: '$products.name' },
                image: { $first: '$products.image' },
                variant: {
                    $first: {
                        $ifNull: [
                            {
                                $arrayElemAt: ["$products.variants", 0]
                            },
                            {}
                        ]
                    }
                },
                quantity: { $first: '$items.quantity' },
                price: { $first: { $multiply: ['$items.quantity', '$products.price'] } }
            }
        },
        {
            $project: {
                name: 1,
                image: 1,
                'variant.size': 1,
                'variant.color': 1,
                quantity: 1,
                price: 1,
                _id: 0,
                id: '$_id'
            }
        },
        // { $sort: logic }
        {
            $skip: ((page - 1) * limit)
        },
        {
            $limit: limit
        }
    ]

    return dbRepo.aggregate(constant.COLLECTIONS.CART, pipeline)
}

exports.getCartProductsBySearch = (userId, { keyword, page, limit }) => {
    Logger.info(`Inside getProductsBySearch => keyword = ${keyword} page = ${page} & limit = ${limit}`)

    page ||= 1
    limit ||= 10

    const pipeline = [
        {
            $match: {
                user: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $unwind: '$items'
        },
        {
            $lookup: {
                from: 'products',
                localField: 'items.product',
                foreignField: '_id',
                as: 'products'
            }
        },
        {
            $unwind: '$products'
        },
        {
            $match: {
                $or: [
                    { 'products.name': { $regex: keyword, $options: 'i' } },
                    { 'products.description': { $regex: keyword, $options: 'i' } }
                ]
            }
        },
        {
            $group: {
                _id: '$products._id',
                name: { $first: '$products.name' },
                image: { $first: '$products.image' },
                variant: {
                    $first: {
                        $ifNull: [
                            {
                                $arrayElemAt: ["$products.variants", 0]
                            },
                            {}
                        ]
                    }
                },
                quantity: { $first: '$items.quantity' },
                price: { $first: { $multiply: ['$items.quantity', '$products.price'] } }
            }
        },
        {
            $project: {
                name: 1,
                image: 1,
                'variant.size': 1,
                'variant.color': 1,
                quantity: 1,
                price: 1,
                _id: 0,
                id: '$_id'
            }
        },
        // { $sort: logic }
        {
            $skip: ((page - 1) * limit)
        },
        {
            $limit: limit
        }
    ]

    return dbRepo.aggregate(constant.COLLECTIONS.CART, pipeline)
}

exports.getTotalAmount = (userId) => {
    const pipeline = [
        {
            $match: {
                user: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $unwind: '$items'
        },
        {
            $lookup: {
                from: 'products',
                localField: 'items.product',
                foreignField: '_id',
                as: 'products'
            }
        },
        {
            $unwind: '$products'
        },
        {
            $group: {
                _id: null,
                amount: {
                    $sum: { $multiply: ['$items.quantity', '$products.price'] }
                }
            }
        },
        {
            $project: {
                amount: 1,
                _id: 0
            }
        }
    ]

    return dbRepo.aggregate(constant.COLLECTIONS.CART, pipeline)
}

exports.getCheckoutProducts = (userId) => {
    const query = {
        user: new mongoose.Types.ObjectId(userId)
    }

    const data = {
        'items.product': 1,
        'items.quantity': 1
    }

    return dbRepo.findOne(constant.COLLECTIONS.CART, { query, data })
}

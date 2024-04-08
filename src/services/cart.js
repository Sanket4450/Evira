const mongoose = require('mongoose')
const httpStatus = require('http-status')
const dbRepo = require('../dbRepo')
const constant = require('../constants')
const ApiError = require('../utils/ApiError')

exports.getCartProductVariant = (productId, variantId, userId) => {
    const query = {
        user: new mongoose.Types.ObjectId(userId),
        'items.product': { $eq: new mongoose.Types.ObjectId(productId) },
        'items.variant': { $eq: new mongoose.Types.ObjectId(variantId) },
    }

    const data = {
        'items.product': 1,
        'items.variant': 1,
        'items.quantity': 1,
    }

    return dbRepo.findOne(constant.COLLECTIONS.CART, { query, data })
}

exports.cartAction = ({ action, productId, variantId, userId, quantity }) => {
    Logger.info(
        `Inside cartAction => action = ${action}, product = ${productId}, variant = ${variantId}, quantity = ${quantity}`
    )

    quantity ||= 1

    const query =
        action === 'add' || action === 'remove'
            ? {
                  user: new mongoose.Types.ObjectId(userId),
              }
            : action === 'increase' || action === 'decrease'
            ? {
                  user: new mongoose.Types.ObjectId(userId),
                  'items.product': new mongoose.Types.ObjectId(productId),
                  'items.variant': new mongoose.Types.ObjectId(variantId),
              }
            : undefined

    const data =
        action === 'add'
            ? {
                  $push: {
                      items: {
                          product: new mongoose.Types.ObjectId(productId),
                          variant: new mongoose.Types.ObjectId(variantId),
                          quantity,
                          addedAt: Date.now(),
                      },
                  },
              }
            : action === 'remove'
            ? {
                  $pull: {
                      items: {
                          variant: new mongoose.Types.ObjectId(variantId),
                      },
                  },
              }
            : action === 'increase'
            ? {
                  $inc: {
                      'items.$.quantity': quantity,
                  },
              }
            : action === 'decrease'
            ? {
                  $inc: {
                      'items.$.quantity': -quantity,
                  },
              }
            : undefined

    if (!query || !data)
        throw new ApiError(
            constant.MESSAGES.ENTER_VALID_ACTION,
            httpStatus.BAD_REQUEST
        )

    const options = {
        upsert: true,
    }

    return dbRepo.updateOne(constant.COLLECTIONS.CART, { query, data, options })
}

exports.getCartActionProductAmount = async (productId, userId) => {
    Logger.info(
        `Inside getCartActionProduct => product = ${productId}, user = ${userId}`
    )

    const pipeline = [
        {
            $match: {
                user: new mongoose.Types.ObjectId(userId),
            },
        },
        {
            $unwind: '$items',
        },
        {
            $match: {
                'items.product': new mongoose.Types.ObjectId(productId),
            },
        },
        {
            $lookup: {
                from: 'variants',
                localField: 'items.variant',
                foreignField: '_id',
                as: 'variant',
            },
        },
        {
            $unwind: '$variant',
        },
        {
            $group: {
                _id: null,
                amount: {
                    $sum: { $multiply: ['$items.quantity', '$variant.price'] },
                },
            },
        },
        {
            $project: {
                amount: 1,
                _id: 0,
            },
        },
    ]

    return dbRepo.aggregate(constant.COLLECTIONS.CART, pipeline)
}

exports.getCartProducts = (userId) => {
    Logger.info('Inside getCartProducts')

    const pipeline = [
        {
            $match: {
                user: new mongoose.Types.ObjectId(userId),
            },
        },
        {
            $unwind: '$items',
        },
        {
            $lookup: {
                from: 'products',
                localField: 'items.product',
                foreignField: '_id',
                as: 'product',
            },
        },
        {
            $unwind: '$product',
        },
        {
            $lookup: {
                from: 'variants',
                localField: 'items.variant',
                foreignField: '_id',
                as: 'variant',
            },
        },
        {
            $unwind: '$variant',
        },
        {
            $group: {
                _id: '$variant._id',
                product: { $first: '$product._id' },
                name: { $first: '$product.name' },
                image: { $first: '$product.image' },
                size: { $first: '$variant.size' },
                color: { $first: '$variant.color' },
                quantity: { $first: '$items.quantity' },
                price: {
                    $first: {
                        $multiply: ['$items.quantity', '$variant.price'],
                    },
                },
            },
        },
        {
            $project: {
                product: 1,
                name: 1,
                image: 1,
                size: 1,
                color: 1,
                quantity: 1,
                price: 1,
                _id: 0,
                id: '$_id',
            },
        },
    ]

    return dbRepo.aggregate(constant.COLLECTIONS.CART, pipeline)
}

exports.getCartProductsBySearch = (userId, keyword) => {
    keyword = keyword.trim()

    Logger.info(`Inside getCartProductsBySearch => keyword = ${keyword}`)

    const pipeline = [
        {
            $match: {
                user: new mongoose.Types.ObjectId(userId),
            },
        },
        {
            $unwind: '$items',
        },
        {
            $lookup: {
                from: 'products',
                localField: 'items.product',
                foreignField: '_id',
                as: 'product',
            },
        },
        {
            $unwind: '$product',
        },
        {
            $lookup: {
                from: 'variants',
                localField: 'items.variant',
                foreignField: '_id',
                as: 'variant',
            },
        },
        {
            $unwind: '$variant',
        },
        {
            $match: {
                $or: [
                    { 'product.name': { $regex: keyword, $options: 'i' } },
                    {
                        'product.description': {
                            $regex: keyword,
                            $options: 'i',
                        },
                    },
                    { 'variant.size': { $regex: keyword, $options: 'i' } },
                    { 'variant.color': { $regex: keyword, $options: 'i' } },
                ],
            },
        },
        {
            $group: {
                _id: '$variant._id',
                product: { $first: '$product._id' },
                name: { $first: '$product.name' },
                image: { $first: '$product.image' },
                size: { $first: '$variant.size' },
                color: { $first: '$variant.color' },
                quantity: { $first: '$items.quantity' },
                price: {
                    $first: {
                        $multiply: ['$items.quantity', '$variant.price'],
                    },
                },
            },
        },
        {
            $project: {
                product: 1,
                name: 1,
                image: 1,
                size: 1,
                color: 1,
                quantity: 1,
                price: 1,
                _id: 0,
                id: '$_id',
            },
        },
    ]

    return dbRepo.aggregate(constant.COLLECTIONS.CART, pipeline)
}

exports.getTotalAmount = (userId) => {
    Logger.info('Inside getTotalAmount')

    const pipeline = [
        {
            $match: {
                user: new mongoose.Types.ObjectId(userId),
            },
        },
        {
            $unwind: '$items',
        },
        {
            $lookup: {
                from: 'variants',
                localField: 'items.variant',
                foreignField: '_id',
                as: 'variant',
            },
        },
        {
            $unwind: '$variant',
        },
        {
            $group: {
                _id: null,
                amount: {
                    $sum: { $multiply: ['$items.quantity', '$variant.price'] },
                },
            },
        },
        {
            $project: {
                amount: 1,
                _id: 0,
            },
        },
    ]

    return dbRepo.aggregate(constant.COLLECTIONS.CART, pipeline)
}

exports.getCheckoutProducts = (userId) => {
    Logger.info('Inside getCheckoutProducts')

    const pipeline = [
        {
            $match: {
                user: new mongoose.Types.ObjectId(userId),
            },
        },
        {
            $unwind: '$items',
        },
        {
            $lookup: {
                from: 'variants',
                localField: 'items.variant',
                foreignField: '_id',
                as: 'variant',
            },
        },
        {
            $unwind: '$variant',
        },
        {
            $group: {
                _id: '$variant._id',
                product: { $first: '$items.product' },
                quantity: { $first: '$items.quantity' },
                amount: {
                    $first: {
                        $multiply: ['$items.quantity', '$variant.price'],
                    },
                },
            },
        },
        {
            $project: {
                product: 1,
                variant: '$_id',
                quantity: 1,
                amount: 1,
                _id: 0,
            },
        },
    ]

    return dbRepo.aggregate(constant.COLLECTIONS.CART, pipeline)
}

exports.emptyCart = (userId) => {
    Logger.info('Inside emptyCart')

    const query = {
        user: new mongoose.Types.ObjectId(userId),
    }

    const data = {
        items: [],
    }

    return dbRepo.updateOne(constant.COLLECTIONS.CART, { query, data })
}

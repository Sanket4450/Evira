const mongoose = require('mongoose')
const dbRepo = require('../dbRepo')
const constant = require('../constants')

exports.checkProductLikedWithUserId = (productId, userId) => {
    const query = {
        user: new mongoose.Types.ObjectId(userId),
        'products.product': { $eq: new mongoose.Types.ObjectId(productId) },
    }

    const data = {
        _id: 1,
    }

    return dbRepo.findOne(constant.COLLECTIONS.WISHLIST, { query, data })
}

exports.likeUnlineProduct = (productId, userId, like) => {
    Logger.info(
        `Inside likeUnlineProduct => product = ${productId}, like = ${like}`
    )

    const query = {
        user: new mongoose.Types.ObjectId(userId),
    }

    const data = like
        ? {
              $push: {
                  products: {
                      product: new mongoose.Types.ObjectId(productId),
                      addedAt: Date.now(),
                  },
              },
          }
        : {
              $pull: {
                  products: { product: new mongoose.Types.ObjectId(productId) },
              },
          }

    const options = {
        upsert: true,
    }

    return dbRepo.updateOne(constant.COLLECTIONS.WISHLIST, {
        query,
        data,
        options,
    })
}

exports.getWishlistProducts = (userId, { page, limit }) => {
    Logger.info(
        `Inside getWishlistProducts => page = ${page}, limit = ${limit}`
    )

    page ||= 1
    limit ||= 10

    const pipeline = [
        {
            $match: {
                user: new mongoose.Types.ObjectId(userId),
            },
        },
        {
            $lookup: {
                from: 'products',
                localField: 'products.product',
                foreignField: '_id',
                as: 'products',
            },
        },
        {
            $unwind: '$products',
        },
        {
            $lookup: {
                from: 'reviews',
                localField: 'products._id',
                foreignField: 'product',
                as: 'reviews',
            },
        },
        {
            $group: {
                _id: '$products._id',
                name: { $first: '$products.name' },
                image: { $first: '$products.image' },
                price: { $first: '$products.price' },
                sold: { $first: '$products.sold' },
                stars: {
                    $first: {
                        $round: [
                            {
                                $ifNull: [
                                    {
                                        $avg: '$reviews.star',
                                    },
                                    0,
                                ],
                            },
                            1,
                        ],
                    },
                },
                isLiked: { $first: true },
            },
        },
        {
            $project: {
                name: 1,
                image: 1,
                price: 1,
                sold: 1,
                stars: 1,
                isLiked: 1,
                _id: 0,
                id: '$_id',
            },
        },
        // { $sort: logic }
        {
            $skip: (page - 1) * limit,
        },
        {
            $limit: limit,
        },
    ]

    return dbRepo.aggregate(constant.COLLECTIONS.WISHLIST, pipeline)
}

exports.getWishlistProductsByCategory = (
    userId,
    categoryId,
    { page, limit }
) => {
    Logger.info(
        `Inside getWishlistProducts => category = ${categoryId}, page = ${page}, limit = ${limit}`
    )

    page ||= 1
    limit ||= 10

    const pipeline = [
        {
            $match: {
                user: new mongoose.Types.ObjectId(userId),
            },
        },
        {
            $lookup: {
                from: 'products',
                localField: 'products.product',
                foreignField: '_id',
                as: 'products',
            },
        },
        {
            $unwind: '$products',
        },
        {
            $match: {
                'products.category': new mongoose.Types.ObjectId(categoryId),
            },
        },
        {
            $lookup: {
                from: 'reviews',
                localField: 'products._id',
                foreignField: 'product',
                as: 'reviews',
            },
        },
        {
            $group: {
                _id: '$products._id',
                name: { $first: '$products.name' },
                image: { $first: '$products.image' },
                price: { $first: '$products.price' },
                sold: { $first: '$products.sold' },
                stars: {
                    $first: {
                        $round: [
                            {
                                $ifNull: [
                                    {
                                        $avg: '$reviews.star',
                                    },
                                    0,
                                ],
                            },
                            1,
                        ],
                    },
                },
                isLiked: { $first: true },
            },
        },
        {
            $project: {
                name: 1,
                image: 1,
                price: 1,
                sold: 1,
                stars: 1,
                isLiked: 1,
                _id: 0,
                id: '$_id',
            },
        },
        // { $sort: logic }
        {
            $skip: (page - 1) * limit,
        },
        {
            $limit: limit,
        },
    ]

    return dbRepo.aggregate(constant.COLLECTIONS.WISHLIST, pipeline)
}

exports.getWishlistProductsBySearch = (
    userId,
    { keyword, category, min_price, max_price, sortBy, rating, page, limit }
) => {
    Logger.info(`Inside getProductsBySearch => keyword = ${keyword}, category = ${category}, min_price = ${min_price},
    max_price = ${max_price}, sortBy = ${sortBy}, rating = ${rating}, page = ${page}, limit = ${limit}`)

    page ||= 1
    limit ||= 10

    const pipeline = []

    pipeline.push(
        {
            $match: {
                user: new mongoose.Types.ObjectId(userId),
            },
        },
        {
            $lookup: {
                from: 'products',
                localField: 'products.product',
                foreignField: '_id',
                as: 'products',
            },
        },
        {
            $unwind: '$products',
        }
    )

    if (keyword && keyword.trim()) {
        pipeline.push({
            $match: {
                $or: [
                    { 'products.name': { $regex: keyword, $options: 'i' } },
                    { 'products.description': { $regex: keyword, $options: 'i' } },
                ],
            },
        })
    }

    if (category) {
        if (new RegExp('^[0-9a-fA-F]{24}$').test(category)) {
            pipeline.push({
                $match: {
                    'products.category': new mongoose.Types.ObjectId(category),
                },
            })
        } else {
            throw new ApiError(
                constant.MESSAGES.ENTER_VALID_CATEGORY,
                httpStatus.CONFLICT
            )
        }
    }

    if (min_price) {
        pipeline.push({
            $match: {
                'products.price': { $gte: min_price },
            },
        })
    }

    if (max_price) {
        pipeline.push({
            $match: {
                'products.price': { $lte: max_price },
            },
        })
    }

    switch (sortBy) {
        case 'recent':
            pipeline.push({
            $sort: {
                'products.updatedAt': -1,
            },
            })
            break

        case 'price_desc':
        pipeline.push({
            $sort: {
            'products.price': -1,
            },
        })
            break

        case 'price_asc':
            pipeline.push({
            $sort: {
                'products.price': 1,
            },
            })
            break

        default:
            pipeline.push({
            $sort: {
                'products.sold': -1,
            },
            })
            break
    }

    pipeline.push(
        {
            $skip: (page - 1) * limit,
        },
        {
            $limit: limit,
        }
    )

    pipeline.push(
        {
            $lookup: {
                from: 'reviews',
                localField: 'products._id',
                foreignField: 'product',
                as: 'reviews',
            },
        },
        {
            $group: {
                _id: '$products._id',
                name: { $first: '$products.name' },
                image: { $first: '$products.image' },
                price: { $first: '$products.price' },
                sold: { $first: '$products.sold' },
                stars: {
                    $first: {
                        $round: [
                            {
                                $ifNull: [
                                    {
                                        $avg: '$reviews.star',
                                    },
                                    0,
                                ],
                            },
                            1,
                        ],
                    },
                },
                isLiked: { $first: true },
            },
        },
        {
            $project: {
                name: 1,
                image: 1,
                price: 1,
                sold: 1,
                stars: 1,
                isLiked: 1,
                _id: 0,
                id: '$_id',
            },
        }
    )

    if (rating) {
        pipeline.push({
            $match: {
                stars: { $gte: rating },
            },
        })
    }

    return dbRepo.aggregate(constant.COLLECTIONS.WISHLIST, pipeline)
}

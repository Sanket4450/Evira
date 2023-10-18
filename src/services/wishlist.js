const mongoose = require('mongoose')
const dbRepo = require('../dbRepo')
const constant = require('../constants')

exports.getWishlistProducts = (userId, { page, limit }) => {
    Logger.info(`Inside getWishlistProducts => page = ${page} & limit = ${limit}`)

    page ||= 1
    limit ||= 10

    const pipeline = [
        {
            $match: {
                userId: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $sort: {
                'products.addedAt': 1
            }
        },
        {
            $lookup: {
                from: 'products',
                localField: 'products.productId',
                foreignField: '_id',
                as: 'product_details'
            }
        },
        {
            $unwind: '$product_details'
        },
        {
            $sort: {
                'products.addedAt': 1
            }
        },
        {
            $lookup: {
                from: 'reviews',
                localField: 'product_details._id',
                foreignField: 'productId',
                as: 'reviews'
            }
        },
        {
            $project: {
                _id: 0,
                'product_details.name': 1,
                'product_details.image': 1,
                'product_details.price': 1,
                'product_details.sold': 1,
                'product_details.stars': {
                    $round: [
                        {
                            $ifNull: [
                                {
                                    $avg: "$reviews.star"
                                },
                                0
                            ]
                        },
                        1
                    ]
                }
            }
        }
    ]
    return dbRepo.aggregate(constant.COLLECTIONS.WISHLIST, pipeline)
}
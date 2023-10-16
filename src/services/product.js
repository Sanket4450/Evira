const mongoose = require('mongoose')
const dbRepo = require('../dbRepo')
const constant = require('../constants')

exports.getProducts = ({ matchCriteria, page, limit }) => {
    Logger.info(`Inside getProducts => page = ${page} & limit = ${limit}`)

    matchCriteria ||= {}
    page ||= 1
    limit ||= 10

    const queryArray = [
        {
            $match: matchCriteria
        },
        {
            $skip: ((page - 1) * limit)
        },
        {
            $limit: limit
        },
        {
            $lookup: {
                from: 'reviews',
                localField: '_id',
                foreignField: 'productId',
                as: 'reviews'
            }
        },
        {
            $unwind: {
                path: '$reviews',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $group: {
                _id: '$_id',
                name: { $first: '$name' },
                image: { $first: '$image' },
                price: { $first: '$price' },
                sold: { $first: '$sold' },
                stars: { $avg: '$reviews.star' }
            }
        },
        {
            $project: {
                name: 1,
                image: 1,
                price: 1,
                sold: 1,
                stars: {
                    $cond: {
                        if: { $gt: ['$stars', null] },
                        then: { $round: ['$stars', 1] },
                        else: 0
                    }
                },
                _id: 0,
                id: '$_id'
            }
        }
    ]
    return dbRepo.aggregate(constant.COLLECTIONS.PRODUCT, queryArray)
}

exports.getProductsByCategory = (categoryId, { matchCriteria, page, limit }) => {
    Logger.info(`Inside getProductsByCategory => page = ${page} & limit = ${limit}`)

    matchCriteria ||= {}
    page ||= 1
    limit ||= 10

    const queryArray = [
        {
            $match: matchCriteria
        },
        {
            $match: {
                category: new mongoose.Types.ObjectId(categoryId)
            }
        },
        {
            $skip: ((page - 1) * limit)
        },
        {
            $limit: limit
        },
        {
            $lookup: {
                from: 'reviews',
                localField: '_id',
                foreignField: 'productId',
                as: 'reviews'
            }
        },
        {
            $unwind: {
                path: '$reviews',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $group: {
                _id: '$_id',
                name: { $first: '$name' },
                image: { $first: '$image' },
                price: { $first: '$price' },
                sold: { $first: '$sold' },
                stars: { $avg: '$reviews.star' }
            }
        },
        {
            $project: {
                name: 1,
                image: 1,
                price: 1,
                sold: 1,
                stars: {
                    $cond: {
                        if: { $gt: ['$stars', null] },
                        then: { $round: ['$stars', 1] },
                        else: 0
                    }
                },
                _id: 0,
                id: '$_id'
            }
        }
    ]
    return dbRepo.aggregate(constant.COLLECTIONS.PRODUCT, queryArray)
}

exports.getProductById = (id) => {
    Logger.info('Inside getProductById => ' + id)

    const queryArray = [
        {
            $match: {
                _id: new mongoose.Types.ObjectId(id)
            }
        },
        {
            $lookup: {
                from: 'reviews',
                localField: '_id',
                foreignField: 'productId',
                as: 'reviews'
            }
        },
        {
            $project: {
                name: 1,
                image: 1,
                description: 1,
                price: 1,
                variants: 1,
                quantity: 1,
                sold: 1,
                stars: {
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
                },
                reviewCount: {
                    $size: '$reviews'
                },
                _id: 0,
                id: '$_id'
            }
        }
    ]
    return dbRepo.aggregate(constant.COLLECTIONS.PRODUCT, queryArray)
}

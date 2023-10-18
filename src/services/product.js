const mongoose = require('mongoose')
const httpStatus = require('http-status')
const dbRepo = require('../dbRepo')
const constant = require('../constants')
const ApiError = require('../utils/ApiError')

exports.getProducts = ({ matchCriteria, page, limit }) => {
    Logger.info(`Inside getProducts => page = ${page} & limit = ${limit}`)

    matchCriteria ||= {}
    page ||= 1
    limit ||= 10

    const pipeline = [
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

    return dbRepo.aggregate(constant.COLLECTIONS.PRODUCT, pipeline)
}

exports.getProductsByCategory = (categoryId, { matchCriteria, page, limit }) => {
    Logger.info(`Inside getProductsByCategory => page = ${page} & limit = ${limit}`)

    matchCriteria ||= {}
    page ||= 1
    limit ||= 10

    const pipeline = [
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

    return dbRepo.aggregate(constant.COLLECTIONS.PRODUCT, pipeline)
}

exports.getProductById = (id) => {
    Logger.info('Inside getProductById => ' + id)

    const pipeline = [
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

    return dbRepo.aggregate(constant.COLLECTIONS.PRODUCT, pipeline)
}

exports.getProductsBySearch = ({ keyword, category, min_price, max_price, sortBy, rating, page, limit }) => {
    Logger.info(`Inside getProductsBySearch => keyword = ${keyword} sortBy = ${sortBy} page = ${page} & limit = ${limit}`)

    page ||= 1
    limit ||= 10

    const pipeline = []

    pipeline.push(
        {
            $match: {
                $or: [
                    { name: { $regex: keyword, $options: 'i' } },
                    { description: { $regex: keyword, $options: 'i' } }
                ]
            }
        })

    if (category) {
        if (new RegExp('^[0-9a-fA-F]{24}$').test(category)) {
            pipeline.push(
                {
                    $match: {
                        category: new mongoose.Types.ObjectId(category)
                    }
                })
        }
        else {
            throw new ApiError(constant.MESSAGES.ENTER_VALID_CATEGORY, httpStatus.CONFLICT)
        }
    }

    if (min_price) {
        pipeline.push(
            {
                $match: {
                    price: { $gte: min_price }
                }
            })
    }

    if (max_price) {
        pipeline.push(
            {
                $match: {
                    price: { $lte: max_price }
                }
            })
    }

    if (rating) {
        pipeline.push(
            {}
        )
    }

    if (sortBy === 'recent') {
        pipeline.push(
            {
                $sort: {
                    modifiedAt: -1
                }
            })
    }
    else if (sortBy === 'price_desc') {
        pipeline.push(
            {
                $sort: {
                    price: -1
                }
            })
    }
    else if (sortBy === 'price_asc') {
        pipeline.push(
            {
                $sort: {
                    price: 1
                }
            })
    }
    else {
        pipeline.push(
            {
                $sort: {
                    sold: -1
                }
            })
    }

    pipeline.push(
        {
            $skip: ((page - 1) * limit)
        },
        {
            $limit: limit
        })

    pipeline.push(
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
                price: 1,
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
                _id: 0,
                id: '$_id'
            }
        })

    return dbRepo.aggregate(constant.COLLECTIONS.PRODUCT, pipeline)
}

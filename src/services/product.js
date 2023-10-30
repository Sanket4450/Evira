const mongoose = require('mongoose')
const httpStatus = require('http-status')
const dbRepo = require('../dbRepo')
const constant = require('../constants')
const ApiError = require('../utils/ApiError')

exports.getProductById = (id) => {
    const query = {
        _id: new mongoose.Types.ObjectId(id)
    }

    const data = {
        _id: 1
    }

    return dbRepo.findOne(constant.COLLECTIONS.PRODUCT, { query, data })
}

exports.getProductByName = (name) => {
    const query = {
        name: { $regex: name, $options: 'i' }
    }

    const data = {
        _id: 1
    }

    return dbRepo.findOne(constant.COLLECTIONS.PRODUCT, { query, data })
}

exports.getVariant = (variantId, productId) => {
    const query = {
        _id: new mongoose.Types.ObjectId(variantId),
        product: new mongoose.Types.ObjectId(productId)
    }

    const data = {
        _id: 1
    }

    return dbRepo.findOne(constant.COLLECTIONS.VARIANT, { query, data })
}

exports.getVariantById = (id) => {
    const query = {
        _id: new mongoose.Types.ObjectId(id)
    }

    return dbRepo.findOne(constant.COLLECTIONS.VARIANT, { query })
}

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
                foreignField: 'product',
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
                foreignField: 'product',
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
                foreignField: 'product',
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

exports.getFullProductById = (productId) => {
    Logger.info('Inside getFullProductById => ' + productId)

    const pipeline = [
        {
            $match: {
                _id: new mongoose.Types.ObjectId(productId)
            }
        },
        {
            $lookup: {
                from: 'variants',
                localField: '_id',
                foreignField: 'product',
                as: 'variants'
            }
        },
        {
            $lookup: {
                from: 'variants',
                localField: 'defaultVariant',
                foreignField: '_id',
                as: 'defaultVariant'
            }
        },
        {
            $unwind: '$defaultVariant'
        },
        {
            $lookup: {
                from: 'reviews',
                localField: '_id',
                foreignField: 'product',
                as: 'reviews'
            }
        },
        {
            $project: {
                name: 1,
                image: 1,
                description: 1,
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
                reviewCount: {
                    $size: '$reviews'
                },
                defaultVariant: {
                    size: '$defaultVariant.size',
                    color: '$defaultVariant.color',
                    price: '$defaultVariant.price',
                    id: '$defaultVariant._id'
                },
                variants: {
                    $map: {
                        input: "$variants",
                        as: "variant",
                        in: {
                            size: "$$variant.size",
                            color: "$$variant.color",
                            price: '$$variant.price',
                            id: '$$variant._id'
                        }
                    }
                },
                _id: 0,
                id: '$_id'
            }
        }
    ]

    return dbRepo.aggregate(constant.COLLECTIONS.PRODUCT, pipeline)
}

exports.getVariants = (productId) => {
    const query = {
        product: new mongoose.Types.ObjectId(productId)
    }

    const data = {
        product: 0
    }

    return dbRepo.find(constant.COLLECTIONS.VARIANT, { query, data })
}

exports.createVariant = (productId, variantBody) => {
    const data = {
        product: new mongoose.Types.ObjectId(productId),
        ...variantBody
    }
    return dbRepo.create(constant.COLLECTIONS.VARIANT, { data })
}

exports.updateVariant = (variantId, variantBody) => {
    const query = {
        _id: new mongoose.Types.ObjectId(variantId)
    }

    const data = {
        ...variantBody
    }

    return dbRepo.updateOne(constant.COLLECTIONS.VARIANT, { query, data })
}

exports.deleteVariant = (variantId) => {
    const query = {
        _id: new mongoose.Types.ObjectId(variantId)
    }
    return dbRepo.deleteOne(constant.COLLECTIONS.VARIANT, { query })
}

exports.createProduct = (userId, productBody) => {
    const data = {
        user: new mongoose.Types.ObjectId(userId),
        ...productBody
    }
    return dbRepo.create(constant.COLLECTIONS.PRODUCT, { data })
}

exports.updateProduct = (productId, productBody) => {
    const query = {
        _id: new mongoose.Types.ObjectId(productId)
    }

    const data = {
        ...productBody
    }

    return dbRepo.updateOne(constant.COLLECTIONS.PRODUCT, { query, data })
}

exports.deleteProduct = (productId) => {
    const query = {
        _id: new mongoose.Types.ObjectId(productId)
    }
    return dbRepo.deleteOne(constant.COLLECTIONS.PRODUCT, { query })
}

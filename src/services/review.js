const mongoose = require('mongoose')
const dbRepo = require('../dbRepo')
const constant = require('../constants')

exports.getReviews = (productId, { rating, page, limit }) => {
    Logger.info(`Inside getReviews => productId = ${productId} rating = ${rating} page = ${page} & limit = ${limit}`)

    page ||= 1
    limit ||= 15

    const pipeline = []

    pipeline.push(
        {
            $match: {
                productId: new mongoose.Types.ObjectId(productId)
            }
        }
    )

    if (rating) {
        pipeline.push(
            {
                $match: {
                    star: { $eq: rating }
                }
            }
        )
    }

    pipeline.push(
        {
            $addFields: { likes: { $size: '$likedBy' } }
        },
        {
            $sort: {
                likes: -1
            }
        }
    )

    pipeline.push(
        {
            $skip: ((page - 1) * limit)
        },
        {
            $limit: limit
        }
    )

    pipeline.push(
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'users'
            }
        },
        {
            $unwind: {
                path: '$users'
            }
        },
        {
            $group: {
                _id: '$_id',
                fullName: { $first: '$users.fullName' },
                profileImage: { $first: '$users.profileImage' },
                message: { $first: '$message' },
                star: { $first: '$star' },
                likes: { $first: '$likes' },
                createdAt: { $first: '$createdAt' }
            }
        },
        {
            $project: {
                fullName: 1,
                profileImage: 1,
                message: 1,
                star: 1,
                likes: 1,
                createdAt: 1,
                _id: 0,
                id: '$_id'
            }
        }
    )

    return dbRepo.aggregate(constant.COLLECTIONS.REVIEW, pipeline)
}

exports.getReviewsBySearch = (productId, { keyword, rating, page, limit }) => {
    Logger.info(`Inside getReviewsBySearch => productId = ${productId} keyword = ${keyword} rating = ${rating} page = ${page} & limit = ${limit}`)

    page ||= 1
    limit ||= 15

    const pipeline = []

    pipeline.push(
        {
            $match: {
                productId: new mongoose.Types.ObjectId(productId),
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'users'
            }
        },
        {
            $match: {
                'users.fullName': { $regex: keyword, $options: 'i' }
            }
        }
    )

    if (rating) {
        pipeline.push(
            {
                $match: {
                    star: { $eq: rating }
                }
            }
        )
    }

    pipeline.push(
        {
            $addFields: { likes: { $size: '$likedBy' } }
        },
        {
            $sort: {
                likes: -1
            }
        }
    )

    pipeline.push(
        {
            $skip: ((page - 1) * limit)
        },
        {
            $limit: limit
        }
    )

    pipeline.push(
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'users'
            }
        },
        {
            $unwind: {
                path: '$users'
            }
        },
        {
            $group: {
                _id: '$_id',
                fullName: { $first: '$users.fullName' },
                profileImage: { $first: '$users.profileImage' },
                message: { $first: '$message' },
                star: { $first: '$star' },
                likes: { $first: '$likes' },
                createdAt: { $first: '$createdAt' }
            }
        },
        {
            $project: {
                fullName: 1,
                profileImage: 1,
                message: 1,
                star: 1,
                likes: 1,
                createdAt: 1,
                _id: 0,
                id: '$_id'
            }
        }
    )

    return dbRepo.aggregate(constant.COLLECTIONS.REVIEW, pipeline)
}

exports.postReview = ({ productId, userId, ...reviewBody }) => {
    Logger.info(`Inside postReview => productId = ${productId} userId = ${userId}`)

    const data = {
        productId: new mongoose.Types.ObjectId(productId),
        userId: new mongoose.Types.ObjectId(userId),
        ...reviewBody
    }

    return dbRepo.create(constant.COLLECTIONS.REVIEW, { data })
}

exports.getReviewById = (id) => {
    const query = {
        _id: new mongoose.Types.ObjectId(id)
    }

    const data = {
        likedBy: 0
    }

    return dbRepo.findOne(constant.COLLECTIONS.REVIEW, { query, data })
}

exports.checkReviewWithUserId = (reviewId, userId) => {
    const query = {
        _id: new mongoose.Types.ObjectId(reviewId),
        userId: new mongoose.Types.ObjectId(userId)
    }
    return dbRepo.findOne(constant.COLLECTIONS.REVIEW, { query })
}

exports.updateReview = (reviewId, reviewBody) => {
    const query = {
        _id: new mongoose.Types.ObjectId(reviewId)
    }

    const data = {
        $set: {
            ...reviewBody
        }
    }

    return dbRepo.updateOne(constant.COLLECTIONS.REVIEW, { query, data })
}

exports.deleteReview = (reviewId) => {
    const query = {
        _id: new mongoose.Types.ObjectId(reviewId)
    }

    return dbRepo.deleteOne(constant.COLLECTIONS.REVIEW, { query })
}

exports.checkReviewLikedWithUserId = (reviewId, userId) => {
    const query = {
        _id: new mongoose.Types.ObjectId(reviewId),
        likedBy: { $eq: new mongoose.Types.ObjectId(userId) }
    }
    return dbRepo.findOne(constant.COLLECTIONS.REVIEW, { query })
}

exports.likeReview = (reviewId, userId, like) => {
    const query = {
        _id: new mongoose.Types.ObjectId(reviewId)
    }

    const data = like
        ? {
            $push: {
                likedBy: new mongoose.Types.ObjectId(userId)
            }
        } : {
            $pull: {
                likedBy: { $eq: new mongoose.Types.ObjectId(userId) }
            }
        }

    return dbRepo.updateOne(constant.COLLECTIONS.REVIEW, { query, data })
}

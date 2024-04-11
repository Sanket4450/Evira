const mongoose = require('mongoose')
const httpStatus = require('http-status')
const ApiError = require('../utils/ApiError')
const dbRepo = require('../dbRepo')
const constant = require('../constants')
const orderService = require('./order')

const getReviewByProductAndUser = (productId, userId) => {
    const query = {
        product: new mongoose.Types.ObjectId(productId),
        user: new mongoose.Types.ObjectId(userId),
    }

    const data = {
        _id: 1,
    }

    return dbRepo.findOne(constant.COLLECTIONS.REVIEW, { query, data })
}

exports.getReviews = (productId, { rating, page, limit }) => {
    Logger.info(
        `Inside getReviews => product = ${productId}, rating = ${rating}, page = ${page}, limit = ${limit}`
    )

    page ||= 1
    limit ||= 15

    const pipeline = []

    pipeline.push({
        $match: {
            product: new mongoose.Types.ObjectId(productId),
        },
    })

    if (rating) {
        pipeline.push({
            $match: {
                star: { $eq: rating },
            },
        })
    }

    pipeline.push(
        {
            $addFields: { likes: { $size: '$likedBy' } },
        },
    )

    pipeline.push(
        {
            $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'users',
            },
        },
        {
            $unwind: {
                path: '$users',
            },
        },
        {
            $group: {
                _id: '$_id',
                fullName: { $first: '$users.fullName' },
                profileImage: { $first: '$users.profileImage' },
                message: { $first: '$message' },
                star: { $first: '$star' },
                likes: { $first: '$likes' },
                createdAt: { $first: '$createdAt' },
            },
        },
        {
            $sort: {
                likes: -1,
            },
        },
        {
            $skip: (page - 1) * limit,
        },
        {
            $limit: limit,
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
                id: '$_id',
            },
        }
    )

    return dbRepo.aggregate(constant.COLLECTIONS.REVIEW, pipeline)
}

exports.getReviewsBySearch = (productId, { keyword, rating, page, limit }) => {
    Logger.info(
        `Inside getReviewsBySearch => product = ${productId}, keyword = ${keyword}, rating = ${rating}, page = ${page}, limit = ${limit}`
    )

    page ||= 1
    limit ||= 15

    const pipeline = []

    pipeline.push(
        {
            $match: {
                product: new mongoose.Types.ObjectId(productId),
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'users',
            },
        },
    )

    if (keyword) {
        pipeline.push({
            $match: {
                'users.fullName': { $regex: keyword, $options: 'i' },
            },
        })
    }

    if (rating) {
        pipeline.push({
            $match: {
                star: { $eq: rating },
            },
        })
    }

    pipeline.push(
        {
            $addFields: { likes: { $size: '$likedBy' } },
        },
    )

    pipeline.push(
        {
            $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'users',
            },
        },
        {
            $unwind: {
                path: '$users',
            },
        },
        {
            $group: {
                _id: '$_id',
                fullName: { $first: '$users.fullName' },
                profileImage: { $first: '$users.profileImage' },
                message: { $first: '$message' },
                star: { $first: '$star' },
                likes: { $first: '$likes' },
                createdAt: { $first: '$createdAt' },
            },
        },
        {
            $sort: {
                likes: -1,
            },
        },
        {
            $skip: (page - 1) * limit,
        },
        {
            $limit: limit,
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
                id: '$_id',
            },
        }
    )

    return dbRepo.aggregate(constant.COLLECTIONS.REVIEW, pipeline)
}

exports.postReview = async (reviewBody) => {
    Logger.info(`Inside postReview => product = ${reviewBody.product}`)

    const { product, user } = reviewBody

    if (!await orderService.checkUserCompletedOrder(product, user)) {
        throw new ApiError(
          constant.MESSAGES.CANNOT_POST_REVIEW,
          httpStatus.FORBIDDEN
        )
    }

    if (await getReviewByProductAndUser(product, user)) {
        throw new ApiError(
          constant.MESSAGES.REVIEW_ALREADY_POSTED,
          httpStatus.FORBIDDEN
        )
    }

    const data = {
        ...reviewBody,
    }

    return dbRepo.create(constant.COLLECTIONS.REVIEW, { data })
}

exports.getReviewById = (id) => {
    Logger.info(`Inside getReviewById => review = ${id}`)

    const query = {
        _id: new mongoose.Types.ObjectId(id),
    }

    const data = {
        likedBy: 0,
    }

    return dbRepo.findOne(constant.COLLECTIONS.REVIEW, { query, data })
}

exports.checkReviewWithUserId = (reviewId, userId) => {
    const query = {
        _id: new mongoose.Types.ObjectId(reviewId),
        user: new mongoose.Types.ObjectId(userId),
    }

    const data = {
        _id: 1,
    }

    return dbRepo.findOne(constant.COLLECTIONS.REVIEW, { query, data })
}

exports.validateEditableReviews = async (userId, reviews = []) => {
    for (let review of reviews) {
        if (await exports.checkReviewWithUserId(review.id, userId)) {
            review['isEditable'] = true
        } else {
            review['isEditable'] = false
        }
    }
    return reviews
}

exports.updateReview = (reviewId, reviewBody) => {
    Logger.info(`Inside updateReview => review = ${reviewId}`)

    const query = {
        _id: new mongoose.Types.ObjectId(reviewId),
    }

    const data = {
        $set: {
            ...reviewBody,
        },
    }

    return dbRepo.updateOne(constant.COLLECTIONS.REVIEW, { query, data })
}

exports.deleteReview = (reviewId) => {
    Logger.info(`Inside deleteReview => review = ${reviewId}`)

    const query = {
        _id: new mongoose.Types.ObjectId(reviewId),
    }

    return dbRepo.deleteOne(constant.COLLECTIONS.REVIEW, { query })
}

exports.checkReviewLikedWithUserId = (reviewId, userId) => {
    const query = {
        _id: new mongoose.Types.ObjectId(reviewId),
        likedBy: { $eq: new mongoose.Types.ObjectId(userId) },
    }

    const data = {
        _id: 1,
    }

    return dbRepo.findOne(constant.COLLECTIONS.REVIEW, { query, data })
}

exports.likeUnlikeReview = (reviewId, userId, like) => {
    Logger.info(
        `Inside likeUnlikeReview => review = ${reviewId}, like = ${like}`
    )

    const query = {
        _id: new mongoose.Types.ObjectId(reviewId),
    }

    const data = like
        ? {
              $push: {
                  likedBy: new mongoose.Types.ObjectId(userId),
              },
          }
        : {
              $pull: {
                  likedBy: { $eq: new mongoose.Types.ObjectId(userId) },
              },
          }

    return dbRepo.updateOne(constant.COLLECTIONS.REVIEW, { query, data })
}

exports.checkReviewPosted = (productId, userId) => {
    const query = {
        product: new mongoose.Types.ObjectId(productId),
        user: new mongoose.Types.ObjectId(userId),
    }

    const data = {
        _id: 1
    }

    return dbRepo.findOne(constant.COLLECTIONS.REVIEW, { query, data })
}

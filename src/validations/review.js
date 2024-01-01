const joi = require('joi')

const {
    pageAndLimit,
    idReqValidation,
    integerNumberValidation,
    stringReqValidation,
    integerNumberReqValidation,
    stringValidation,
    booleanValidation
} = require('./common')

const getReviews = {
    query: joi.object().keys({
        ...pageAndLimit,
        rating: integerNumberValidation.min(1).max(5)
    }),
    params: joi.object().keys({
        productId: idReqValidation
    })
}

const postReview = {
    params: joi.object().keys({
        productId: idReqValidation
    }),
    body: joi.object().keys({
        message: stringReqValidation,
        star: integerNumberReqValidation.min(1).max(5)
    })
}

const getReviewsBySearch = {
    query: joi.object().keys({
        ...pageAndLimit,
        keyword: stringReqValidation.label('Search Keyword'),
        rating: integerNumberValidation.min(1).max(5)
    }),
    params: joi.object().keys({
        productId: idReqValidation
    })
}

const updateReview = {
    params: joi.object().keys({
        reviewId: idReqValidation
    }),
    body: joi.object().keys({
        message: stringValidation,
        star: integerNumberValidation.min(1).max(5)
    })
}

const deleteReview = {
    params: joi.object().keys({
        reviewId: idReqValidation
    })
}

const toggleLike = {
    params: joi.object().keys({
        reviewId: idReqValidation
    }),
    body: joi.object().keys({
        isLiked: booleanValidation
    })
}

module.exports = {
    getReviews,
    getReviewsBySearch,
    postReview,
    updateReview,
    deleteReview,
    toggleLike
}

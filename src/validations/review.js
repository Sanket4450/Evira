const joi = require('joi')

const {
    pageAndLimit,
    idReqValidation,
    integerNumberValidation,
    stringReqValidation,
    integerNumberReqValidation,
    stringValidation,
    booleanReqValidation,
} = require('./common')

const getReviews = {
    query: joi.object().keys({
        ...pageAndLimit,
        rating: integerNumberValidation.min(1).max(5),
    }),
    params: joi.object().keys({
        productId: idReqValidation,
    }),
}

const postReview = {
    params: joi.object().keys({
        productId: idReqValidation,
    }),
    body: joi.object().keys({
        message: stringReqValidation,
        star: integerNumberReqValidation.min(1).max(5),
    }),
}

const updateReview = {
    params: joi.object().keys({
        reviewId: idReqValidation,
    }),
    body: joi.object().keys({
        message: stringValidation,
        star: integerNumberValidation.min(1).max(5),
    }),
}

const deleteReview = {
    params: joi.object().keys({
        reviewId: idReqValidation,
    }),
}

const toggleLike = {
    params: joi.object().keys({
        reviewId: idReqValidation,
    }),
    body: joi.object().keys({
        isLiked: booleanReqValidation,
    }),
}

module.exports = {
    getReviews,
    postReview,
    updateReview,
    deleteReview,
    toggleLike,
}

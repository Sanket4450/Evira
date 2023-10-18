const joi = require('joi')

const {
    pageAndLimit,
    idValidation,
    integerNumberValidation,
    stringReqValidation,
    integerNumberReqValidation,
    stringValidation,
    toggleValidation
} = require('./common')

const getReviews = {
    query: joi.object().keys({
        ...pageAndLimit,
        rating: integerNumberValidation.valid(1, 2, 3, 4, 5)
    }),
    params: joi.object().keys({
        productId: idValidation
    })
}

const getReviewsBySearch = {
    query: joi.object().keys({
        ...pageAndLimit,
        keyword: stringReqValidation.label('Search Keyword'),
        rating: integerNumberValidation.valid(1, 2, 3, 4, 5)
    }),
    params: joi.object().keys({
        productId: idValidation
    })
}

const postReview = {
    params: joi.object().keys({
        productId: idValidation
    }),
    body: joi.object().keys({
        message: stringReqValidation,
        star: integerNumberReqValidation
    })
}

const updateReview = {
    params: joi.object().keys({
        reviewId: idValidation
    }),
    body: joi.object().keys({
        message: stringValidation,
        star: integerNumberValidation
    })
}

const deleteReview = {
    params: joi.object().keys({
        reviewId: idValidation
    })
}

const toggleLike = {
    params: joi.object().keys({
        reviewId: idValidation
    }),
    query: joi.object().keys({
        like: toggleValidation
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

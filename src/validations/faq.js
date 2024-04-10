const joi = require('joi')

const {
    pageAndLimit,
    stringReqValidation
} = require('./common')

const getFAQs = {
    query: joi.object().keys({
        ...pageAndLimit,
    }),
}

const postFAQ = {
    body: joi.object().keys({
        title: stringReqValidation.max(80),
        description: stringReqValidation.max(500),
    }),
}

module.exports = {
    applyPromoCode,
    postCheckout,
}

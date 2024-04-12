const joi = require('joi')

const {
    idReqValidation,
    stringReqValidation,
    numberReqValidation,
    dateValidation,
    idValidation,
    stringValidation,
    numberValidation,
    pageAndLimit,
} = require('./common')

const getOffers = {
    query: joi.object().keys({
        ...pageAndLimit,
    }),
}

const getProductOffers = {
    params: joi.object().keys({
        productId: idReqValidation,
    }),
}

const postOffer = {
    body: joi.object().keys({
        product: idReqValidation,
        image: stringValidation,
        discountPercentage: numberReqValidation.max(90).precision(2),
        startDate: dateValidation.required(),
        endDate: dateValidation.required(),
    }),
}

const updateOffer = {
    params: joi.object().keys({
        offerId: idReqValidation,
    }),
    body: joi.object().keys({
        image: stringValidation,
        discountPercentage: numberValidation.max(90).precision(2),
        startDate: dateValidation,
        endDate: dateValidation,
    }),
}

const deleteOffer = {
    params: joi.object().keys({
        offerId: idReqValidation,
    }),
}

module.exports = {
    getOffers,
    getProductOffers,
    postOffer,
    updateOffer,
    deleteOffer,
}

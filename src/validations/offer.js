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

const getAdminOffer = {
    params: joi.object().keys({
        offerId: idReqValidation,
    }),
}

const postOffer = {
    body: joi.object().keys({
        product: idReqValidation,
        image: stringReqValidation,
        discountPercentage: numberReqValidation.max(90).precision(2),
        startDate: dateValidation,
        endDate: dateValidation.required(),
    }),
}

const updateOffer = {
    params: joi.object().keys({
        offerId: idReqValidation,
    }),
    body: joi.object().keys({
        product: idValidation,
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
    getAdminOffer,
    postOffer,
    updateOffer,
    deleteOffer,
}

const joi = require('joi')

const {
    stringReqValidation,
    stringValidation,
    numberReqValidation,
    idReqValidation,
    numberValidation,
} = require('./common')

const postShippingType = {
    body: joi.object().keys({
        title: stringReqValidation,
        description: stringValidation.max(200),
        charge: numberReqValidation.precision(2),
    }),
}

const updateShippingType = {
    params: joi.object().keys({
        shippingId: idReqValidation,
    }),
    body: joi.object().keys({
        title: stringValidation,
        description: stringValidation.max(200),
        charge: numberValidation.precision(2),
    }),
}

const deleteShippingType = {
    params: joi.object().keys({
        shippingId: idReqValidation,
    }),
}

module.exports = {
    postShippingType,
    updateShippingType,
    deleteShippingType,
}

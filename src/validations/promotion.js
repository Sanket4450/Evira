const joi = require('joi')

const {
    stringReqValidation,
    stringValidation,
    numberReqValidation,
    integerNumberReqValidation,
    dateValidation,
    integerNumberValidation,
    numberValidation,
    idReqValidation,
    pageAndLimit
} = require('./common')

const getAdminPromoCodes = {
    query: joi.object().keys({
        ...pageAndLimit
    })
}

const postPromoCode = {
    body: joi.object().keys({
        title: stringReqValidation,
        description: stringValidation.max(80),
        discountPercentage: numberReqValidation.max(90).precision(2),
        maxUses: integerNumberReqValidation,
        validFrom: dateValidation,
        validUntil: dateValidation.required()
    })
}

const updatePromoCode = {
    params: joi.object().keys({
        promoId: idReqValidation
    }),
    body: joi.object().keys({
        title: stringValidation,
        description: stringValidation.max(80),
        discountPercentage: numberValidation.max(90).precision(2),
        maxUses: integerNumberValidation,
        remainingUses: integerNumberValidation,
        validFrom: dateValidation,
        validUntil: dateValidation
    })
}

const deletePromoCode = {
    params: joi.object().keys({
        promoId: idReqValidation
    })
}

module.exports = {
    getAdminPromoCodes,
    postPromoCode,
    updatePromoCode,
    deletePromoCode
}

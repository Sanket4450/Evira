const joi = require('joi')

const {
    idValidation,
    stringValidation,
    stringReqValidation,
    numberReqValidation
} = require('./common')

const addPromoCode = {
    params: joi.object().keys({
        promoId: idValidation
    })
}

const postCheckout = {
    body: joi.object().keys({
        address: idValidation.label('Address'),
        shipping: idValidation.label('Shipping-type'),
        promo: stringValidation.label('Promo-code'),
        amount: numberReqValidation.precision(2).label('Total Amount')
    })
}

module.exports = {
    addPromoCode,
    postCheckout
}
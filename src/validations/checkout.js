const joi = require('joi')

const {
    idReqValidation,
    stringValidation,
    numberReqValidation
} = require('./common')

const applyPromoCode = {
    params: joi.object().keys({
        promoId: idReqValidation
    })
}

const postCheckout = {
    body: joi.object().keys({
        address: idReqValidation.label('Address'),
        shipping: idReqValidation.label('Shipping-type'),
        promo: stringValidation.label('Promo-code'),
        amount: numberReqValidation.precision(2).label('Total Amount')
    })
}

module.exports = {
    applyPromoCode,
    postCheckout
}

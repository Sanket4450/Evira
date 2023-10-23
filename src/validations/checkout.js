const joi = require('joi')

const {
    idValidation,
    stringValidation,
    integerNumberReqValidation,
    stringReqValidation
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
        amount: integerNumberReqValidation.label('Total Amount')
    })
}

const prePayment = {
    body: joi.object().keys({
        orderId: idValidation,
        paymentId: idValidation
    })
}

const postPayment = {
    body: joi.object().keys({
        orderId: idValidation,
        pin: stringReqValidation.length(4)
            .pattern(/^[0-9]+$/)
            .messages({ 'string.pattern.base': 'PIN must be 4 digit numeric value' })
    })
}

module.exports = {
    addPromoCode,
    postCheckout,
    prePayment,
    postPayment
}
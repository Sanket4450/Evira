const joi = require('joi')

const {
    idReqValidation,
    numberReqValidation,
    idValidation,
} = require('./common')

const postCheckout = {
    body: joi.object().keys({
        address: idReqValidation.label('Address'),
        shipping: idReqValidation.label('Shipping-type'),
        promo: idValidation.label('Promo-code'),
        amount: numberReqValidation.precision(2).label('Total Amount'),
    }),
}

module.exports = {
    postCheckout,
}

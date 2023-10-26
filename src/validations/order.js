const joi = require('joi')

const {
    pageAndLimit,
    stringReqValidation,
    idValidation
} = require('./common')

const getOrders = {
    query: joi.object().keys({
        ...pageAndLimit
    }),
    params: joi.object().keys({
        type: stringReqValidation.lowercase().valid('ongoing', 'completed').label('Order Status')
    })
}

const trackOrder = {
    params: joi.object().keys({
        orderId: idValidation
    })
}

module.exports = {
    getOrders,
    trackOrder
}
const joi = require('joi')

const {
    pageAndLimit,
    stringReqValidation,
    idReqValidation,
    stringValidation,
    idValidation,
    dateValidation,
} = require('./common')

const getOrders = {
    query: joi.object().keys({
        ...pageAndLimit,
    }),
    params: joi.object().keys({
        type: stringReqValidation
            .lowercase()
            .valid('ongoing', 'completed')
            .label('Order Status'),
    }),
}

const trackOrder = {
    params: joi.object().keys({
        orderId: idReqValidation,
    }),
}

const cancelOrder = {
    params: joi.object().keys({
        orderId: idReqValidation,
    }),
}

const getAdminOrders = {
    query: joi.object().keys({
        ...pageAndLimit,
        type: stringValidation
            .lowercase()
            .valid('all', 'ongoing', 'completed')
            .label('Order Status'),
    }),
}

const getAdminOrder = {
    params: joi.object().keys({
        orderId: idReqValidation,
    }),
}

const updateOrder = {
    params: joi.object().keys({
        orderId: idReqValidation,
    }),
    body: joi.object().keys({
        address: idValidation,
        type: stringValidation
            .lowercase()
            .valid('ongoing', 'completed')
            .label('Order Status'),
        status: joi.object().keys({
            title: stringValidation.valid(
                'Ordered',
                'Shipped',
                'Out for Delivery',
                'Delivered',
                'Canceled',
            ),
            description: stringValidation,
            date: dateValidation,
        }),
    }),
}

module.exports = {
    getOrders,
    trackOrder,
    cancelOrder,
    getAdminOrders,
    getAdminOrder,
    updateOrder,
}

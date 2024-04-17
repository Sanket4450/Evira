const joi = require('joi')

const {
    pageAndLimit,
    stringReqValidation,
    idReqValidation,
    stringValidation,
    booleanValidation,
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
    status: stringReqValidation
      .valid(
        'all',
        'Ordered',
        'Shipped',
        'Out for Delivery',
        'Delivered',
        'Canceled'
      )
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
        status: joi.object().keys({
            title: stringValidation.valid(
                'Ordered',
                'Shipped',
                'Out for Delivery',
                'Delivered',
                'Canceled',
            ),
            description: stringValidation,
            isForwardDirection: booleanValidation
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

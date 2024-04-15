const joi = require('joi')

const { pageAndLimit, idReqValidation } = require('./common')

const getNotifications = {
    query: joi.object().keys({
        ...pageAndLimit,
    }),
}

const deleteNotification = {
    params: joi.object().keys({
        notificationId: idReqValidation,
    }),
}

module.exports = {
    getNotifications,
    deleteNotification,
}

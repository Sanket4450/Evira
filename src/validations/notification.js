const joi = require('joi')

const {
    pageAndLimit,
    idValidation
} = require('./common')

const getNotifications = {
    query: joi.object().keys({
        ...pageAndLimit
    })
}

const deleteNotification = {
    params: joi.object().keys({
        notificationId: idValidation
    })
}

module.exports = {
    getNotifications,
    deleteNotification
}
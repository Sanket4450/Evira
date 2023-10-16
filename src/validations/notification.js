const joi = require('joi')

const {
    pageAndLimit
} = require('./common')

const getNotifications = {
    query: joi.object().keys({
        ...pageAndLimit
    })
}

module.exports = {
    getNotifications
}
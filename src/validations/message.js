const joi = require('joi')

const {
    emailValidation,
    pageAndLimit,
    stringReqValidation
} = require('./common')

const postMessage = {
    body: joi.object().keys({
        email: emailValidation,
        title: stringReqValidation.max(80),
        description: stringReqValidation.max(500),
    }),
}

const getMessages = {
    query: joi.object().keys({
        ...pageAndLimit,
    }),
}

module.exports = {
    postMessage,
    getMessages
}

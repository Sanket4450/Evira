const joi = require('joi')

const {
    emailValidation,
    pageAndLimit,
    stringReqValidation,
    idReqValidation
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

const deleteMessage = {
    params: joi.object().keys({
        messageId: idReqValidation,
    }),
}

module.exports = {
    postMessage,
    getMessages,
    deleteMessage,
}

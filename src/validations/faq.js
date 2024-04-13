const joi = require('joi')

const {
    pageAndLimit,
    stringReqValidation,
    stringValidation,
    idReqValidation
} = require('./common')

const getFAQs = {
    query: joi.object().keys({
        ...pageAndLimit,
    }),
}

const postFAQ = {
    body: joi.object().keys({
        title: stringReqValidation.max(80),
        description: stringReqValidation.max(500),
    }),
}

const updateFAQ = {
    params: joi.object().keys({
        faqId: idReqValidation,
    }),
    body: joi.object().keys({
        title: stringValidation.max(80),
        description: stringValidation.max(500),
    }),
}

const deleteFAQ = {
    params: joi.object().keys({
        faqId: idReqValidation,
    }),
}

module.exports = {
    getFAQs,
    postFAQ,
    updateFAQ,
    deleteFAQ
}

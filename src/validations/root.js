const joi = require('joi')

const {
    stringReqValidation,
} = require('./common')

const uploadFile = {
    body: joi.object().keys({
        type: stringReqValidation.valid('category', 'product', 'offer', 'user'),
    }),
}

module.exports = {
    uploadFile,
}

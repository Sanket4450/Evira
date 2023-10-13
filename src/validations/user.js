const joi = require('joi')

const {
    stringValidation,
    dateValidation,
    numberValidation,
    stringReqValidation
} = require('./common')

const profile = {
    body: joi.object().keys({
        email: stringValidation.email().lowercase(),
        fullName: stringValidation,
        nickName: stringValidation,
        profileImage: stringValidation,
        dateOfBirth: dateValidation,
        mobile: numberValidation,
        gender: stringValidation,
        language: stringValidation,
        role: stringValidation
    })
}

const toggleNotifications = {
    query: joi.object().keys({
        enabled: stringReqValidation
    })
}

module.exports = {
    profile,
    toggleNotifications
}
const joi = require('joi')

const {
    stringValidation,
    dateValidation,
    numberValidation,
    stringReqValidation,
    toggleValidation
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
        enable: toggleValidation
    })
}

module.exports = {
    profile,
    toggleNotifications
}

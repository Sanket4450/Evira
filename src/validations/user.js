const joi = require('joi')

const {
    emailValidation,
    stringValidation,
    dateValidation,
    numberValidation,
    booleanValidation
} = require('./common')

const profile = {
    body: joi.object().keys({
        email: emailValidation,
        fullName: stringValidation,
        nickName: stringValidation,
        profileImage: stringValidation,
        dateOfBirth: dateValidation,
        mobile: numberValidation,
        gender: stringValidation,
        language: stringValidation,
        role: stringValidation,
        isNotificationEnabled: booleanValidation
    })
}

module.exports = {
    profile
}
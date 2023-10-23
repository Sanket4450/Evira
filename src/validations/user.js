const joi = require('joi')

const {
    stringValidation,
    dateValidation,
    numberValidation,
    toggleValidation,
    stringReqValidation,
    integerNumberReqValidation,
    booleanValidation,
    idValidation,
    integerNumberValidation
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

const postAddress = {
    body: joi.object().keys({
        type: stringReqValidation.valid('home', 'office', 'other'),
        street: stringReqValidation.max(100),
        city: stringReqValidation,
        landmark: stringValidation,
        state: stringReqValidation,
        postalCode: integerNumberReqValidation,
        default: booleanValidation
    })
}

const updateAddress = {
    params: joi.object().keys({
        addressId: idValidation
    }),
    body: joi.object().keys({
        type: stringValidation.valid('home', 'office', 'other'),
        street: stringValidation.max(100),
        city: stringValidation,
        landmark: stringValidation,
        state: stringValidation,
        postalCode: integerNumberValidation,
        default: booleanValidation
    })
}

const deleteAddress = {
    params: joi.object().keys({
        addressId: idValidation
    })
}

module.exports = {
    profile,
    toggleNotifications,
    postAddress,
    updateAddress,
    deleteAddress
}

const joi = require('joi')

const {
    stringValidation,
    dateValidation,
    numberValidation,
    stringReqValidation,
    integerNumberReqValidation,
    booleanReqValidation,
    booleanValidation,
    idReqValidation,
    integerNumberValidation,
    pageAndLimit,
    dateReqValidation,
    numberReqValidation
} = require('./common')

const postProfile = {
    body: joi.object().keys({
        fullName: stringReqValidation.max(30),
        nickName: stringReqValidation.max(15),
        profileImage: stringReqValidation,
        dateOfBirth: dateReqValidation,
        mobile: numberReqValidation.min(10 ** 9).max(10 ** 10 - 1).messages({
            'number.min': 'Mobile number should be 10 digit',
            'number.max': 'Mobile number should be 10 digit'
        }),
        gender: stringReqValidation.lowercase().valid('male', 'female', 'other')
    })
}

const updateProfile = {
    body: joi.object().keys({
        email: stringValidation.email().lowercase(),
        fullName: stringValidation.max(30),
        nickName: stringValidation.max(15),
        profileImage: stringValidation,
        dateOfBirth: dateValidation,
        mobile: numberValidation.min(10 ** 9).max(10 ** 10 - 1).messages({
            'number.min': 'Mobile number should be 10 digit',
            'number.max': 'Mobile number should be 10 digit'
        }),
        gender: stringValidation.lowercase().valid('male', 'female', 'other')
    })
}

const toggleNotifications = {
    body: joi.object().keys({
        isEnabled: booleanReqValidation
    })
}

const postAddress = {
    body: joi.object().keys({
        type: stringReqValidation.lowercase().valid('home', 'office', 'other'),
        street: stringReqValidation.max(100),
        city: stringReqValidation,
        landmark: stringValidation,
        state: stringReqValidation,
        country: stringReqValidation,
        postalCode: integerNumberReqValidation,
        default: booleanValidation
    })
}

const updateAddress = {
    params: joi.object().keys({
        addressId: idReqValidation
    }),
    body: joi.object().keys({
        type: stringValidation.lowercase().valid('home', 'office', 'other'),
        street: stringValidation.max(100),
        city: stringValidation,
        landmark: stringValidation,
        state: stringValidation,
        country: stringValidation,
        postalCode: integerNumberValidation,
        default: booleanValidation
    })
}

const deleteAddress = {
    params: joi.object().keys({
        addressId: idReqValidation
    })
}

const getUsers = {
    query: joi.object().keys({
        ...pageAndLimit
    })
}

const getUser = {
    params: joi.object().keys({
        userId: idReqValidation
    })
}

const updateUser = {
    params: joi.object().keys({
        userId: idReqValidation
    }),
    body: {
        email: stringValidation.email().lowercase(),
        fullName: stringValidation.max(30),
        nickName: stringValidation.max(15),
        profileImage: stringValidation,
        dateOfBirth: dateValidation,
        mobile: numberValidation.min(10 ** 9).max(10 ** 10 - 1).messages({
            'number.min': 'Mobile number should be 10 digit',
            'number.max': 'Mobile number should be 10 digit'
        }),
        gender: stringValidation.lowercase().valid('male', 'female', 'other'),
        language: stringValidation,
        role: stringValidation.lowercase().valid('user', 'admin')
    }
}

const deleteUser = {
    params: joi.object().keys({
        userId: idReqValidation
    })
}

module.exports = {
    postProfile,
    updateProfile,
    toggleNotifications,
    postAddress,
    updateAddress,
    deleteAddress,
    getUsers,
    getUser,
    updateUser,
    deleteUser
}

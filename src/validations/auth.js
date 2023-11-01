const joi = require('joi')

const {
    emailValidation,
    passwordValidation,
    stringValidation,
    stringReqValidation,
    integerNumberReqValidation,
    numberValidation,
    numberReqValidation,
    dateValidation,
    booleanValidation,
    secretValidation,
} = require('./common')

const register = {
    body: joi.object().keys({
        email: emailValidation,
        password: passwordValidation,
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
        role: stringValidation.lowercase().valid('user', 'admin'),
        secret: secretValidation,
        isNotificationEnabled: booleanValidation
    })
}

const login = {
    body: joi.object().keys({
        email: emailValidation,
        password: passwordValidation
    })
}

const forgotPasswordWithEmail = {
    body: joi.object().keys({
        email: emailValidation
    })
}

const forgotPasswordWithMobile = {
    body: joi.object().keys({
        mobile: numberReqValidation.min(10 ** 9).max(10 ** 10 - 1).messages({
            'number.min': 'Mobile number should be 10 digit',
            'number.max': 'Mobile number should be 10 digit'
        }),
    })
}

const verifyResetOtp = {
    body: joi.object().keys({
        token: stringReqValidation,
        otp: integerNumberReqValidation
    })
}

const resetPassword = {
    body: joi.object().keys({
        token: stringReqValidation,
        password: passwordValidation
    })
}

const refreshTokens = {
    body: joi.object().keys({
        token: stringReqValidation
    })
}

module.exports = {
    register,
    login,
    forgotPasswordWithEmail,
    forgotPasswordWithMobile,
    verifyResetOtp,
    resetPassword,
    refreshTokens
}

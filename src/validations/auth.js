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
    booleanValidation
} = require('./common')

const register = {
    body: joi.object().keys({
        email: emailValidation,
        password: passwordValidation,
        fullName: stringValidation.max(30),
        nickName: stringValidation.max(15),
        profileImage: stringValidation,
        dateOfBirth: dateValidation,
        mobile: numberValidation.label('Mobile Number'),
        gender: stringValidation.valid('male', 'female', 'other'),
        language: stringValidation,
        role: stringValidation.valid('user', 'admin'),
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
        mobile: numberReqValidation.label('Mobile Number')
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

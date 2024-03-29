const joi = require('joi')

const {
    emailValidation,
    passwordValidation,
    stringValidation,
    stringReqValidation,
    integerNumberReqValidation,
    numberReqValidation,
    secretValidation,
} = require('./common')

const register = {
    body: joi.object().keys({
        email: emailValidation,
        password: passwordValidation,
        role: stringValidation.lowercase().valid('user', 'admin'),
        secret: secretValidation,
    }),
}

const login = {
    body: joi.object().keys({
        email: emailValidation,
        password: passwordValidation,
    }),
}

const forgotPasswordWithEmail = {
    body: joi.object().keys({
        email: emailValidation,
    }),
}

const verifyResetOtp = {
    body: joi.object().keys({
        token: stringReqValidation,
        otp: integerNumberReqValidation,
    }),
}

const resetPassword = {
    body: joi.object().keys({
        token: stringReqValidation,
        password: passwordValidation,
    }),
}

const refreshTokens = {
    body: joi.object().keys({
        token: stringReqValidation,
    }),
}

module.exports = {
    register,
    login,
    forgotPasswordWithEmail,
    verifyResetOtp,
    resetPassword,
    refreshTokens,
}

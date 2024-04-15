const joi = require('joi')

const {
    emailValidation,
    passwordValidation,
    stringValidation,
    stringReqValidation,
    integerNumberReqValidation,
    secretValidation,
    booleanValidation,
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
        password: stringReqValidation,
        isAdmin: booleanValidation
    }),
}

const forgotPasswordWithEmail = {
    body: joi.object().keys({
        email: emailValidation,
        isAdmin: booleanValidation
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

const resetOldPassword = {
    body: joi.object().keys({
        oldPassword: passwordValidation,
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
    resetOldPassword,
    refreshTokens,
}

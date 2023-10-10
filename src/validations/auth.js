import joi from 'joi'

import {
    emailValidation,
    passwordValidation,
    numberReqValidation,
    stringReqValidation,
    integerNumberReqValidation,
    stringValidation,
    dateValidation,
    integerNumberValidation,
    booleanValidation
} from './common.js'

export const register = {
    body: joi.object().keys({
        email: emailValidation,
        password: passwordValidation,
        mobile: numberReqValidation,
        fullName: stringValidation,
        nickName: stringValidation,
        profileImage: stringValidation,
        dateOfBirth: dateValidation,
        gender: stringValidation,
        language: stringValidation,
        role: integerNumberValidation,
        isNotificationEnabled: booleanValidation
    })
}

export const login = {
    body: joi.object().keys({
        email: emailValidation,
        password: passwordValidation
    })
}

export const forgotPasswordWithEmail = {
    body: joi.object().keys({
        email: emailValidation
    })
}

export const forgotPasswordWithMobile = {
    body: joi.object().keys({
        mobile: numberReqValidation
    })
}

export const verifyResetOtp = {
    body: joi.object().keys({
        token: stringReqValidation,
        otp: integerNumberReqValidation
    })
}

export const resetPassword = {
    body: joi.object().keys({
        token: stringReqValidation,
        password: passwordValidation
    })
}

export const generateTokens = {
    body: joi.object().keys({
        token: stringReqValidation
    })
}
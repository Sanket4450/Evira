const joi = require('joi')

const stringValidation = joi.string().trim()
const stringReqValidation = stringValidation.required()
const emailValidation = stringReqValidation.email().lowercase()
const passwordValidation = stringReqValidation.min(8)
const numberValidation = joi.number()
const numberReqValidation = numberValidation.required()
const integerNumberValidation = numberValidation.integer()
const integerNumberReqValidation = integerNumberValidation.required()
const booleanValidation = joi.boolean().strict(true)
const dateValidation = joi.date()
const arrayValidation = joi.array()

module.exports = {
    stringValidation,
    stringReqValidation,
    emailValidation,
    passwordValidation,
    numberValidation,
    numberReqValidation,
    integerNumberValidation,
    integerNumberReqValidation,
    booleanValidation,
    dateValidation,
    arrayValidation
}
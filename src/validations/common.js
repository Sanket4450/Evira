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

const pageAndLimit = {
    page: integerNumberValidation.min(1),
    limit: integerNumberValidation.min(1)
}

const idValidation = stringReqValidation
    .pattern(new RegExp('^[0-9a-fA-F]{24}$'))
    .messages({ 'string.pattern.base': 'Invalid ID. Please provide a valid ObjectId' })

const toggleValidation = [
    joi.string().trim().valid('true', 'false'), joi.number().valid(1, 0)
]

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
    arrayValidation,
    pageAndLimit,
    idValidation,
    toggleValidation
}

const joi = require('joi')

const stringValidation = joi.string().trim()
const stringReqValidation = stringValidation.required()
const emailValidation = stringReqValidation.email().lowercase()
const passwordValidation = stringReqValidation.min(8)
const numberValidation = joi.number()
const numberReqValidation = numberValidation.required()
const integerNumberValidation = numberValidation.integer()
const integerNumberReqValidation = integerNumberValidation.required()
const booleanValidation = joi.boolean().strict()
const booleanReqValidation = booleanValidation.required()
const dateValidation = joi.date()
const dateReqValidation = joi.date().required()
const arrayValidation = joi.array()

const pageAndLimit = {
    page: integerNumberValidation.min(1),
    limit: integerNumberValidation.min(1),
}

const secretValidation = stringValidation
    .pattern(new RegExp('^[A-Za-z0-9_@/?%]*$'))
    .messages({
        'string.pattern.base':
            'Invalid secret. Secret does not match with the pattern',
    })

const idValidation = stringValidation
    .pattern(new RegExp('^[0-9a-fA-F]{24}$'))
    .messages({
        'string.pattern.base': 'Invalid ID. Please provide a valid ObjectId',
    })

const idReqValidation = idValidation.required()

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
    booleanReqValidation,
    dateValidation,
    dateReqValidation,
    arrayValidation,
    pageAndLimit,
    secretValidation,
    idValidation,
    idReqValidation,
}

const joi = require('joi')
const httpStatus = require('http-status')
const pick = require('../utils/pick')
const ApiError = require('../utils/ApiError')

const schemaOptions = {
    errors: {
        wrap: {
            label: '',
        },
    },
}

const validate = (schema) => (req, _, next) => {
    const validSchema = pick(schema, ['query', 'params', 'body'])
    const object = pick(req, Object.keys(validSchema))
    const { value, error } = joi
        .compile(validSchema)
        .prefs({ errors: { label: 'key' }, abortEarly: false })
        .validate(object, schemaOptions)

    if (error) {
        const errorMessage = error.details[0].message
        return next(new ApiError(errorMessage, httpStatus.BAD_REQUEST))
    }
    Object.assign(req, value)
    return next()
}

module.exports = validate

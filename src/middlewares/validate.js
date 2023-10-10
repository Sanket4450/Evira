import joi from 'joi'
import httpStatus from 'http-status'
import pick from '../utils/pick.js'
import ApiError from '../utils/ApiError.js'

const validate = (schema) => (req, res, next) => {
    const validSchema = pick(schema, ['params', 'query', 'body'])
    const object = pick(req, Object.keys(validSchema))

    const { value, error } = joi.validate(object)

    if (error) {
        const errorMessage = error.details[0].message
        Logger.error(errorMessage)
        return next(new ApiError(errorMessage, httpStatus.BAD_REQUEST))
    }
    Object.assign(req, value)
    return next()
}

export default validate
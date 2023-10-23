const httpStatus = require('http-status')
const ApiError = require('../utils/ApiError')
const constant = require('../constants')

const toBoolean = (keyword) => {
    if (keyword === 'true' || keyword === 1) {
        return true
    }
    else if (keyword === 'false' || keyword === 0) {
        return false
    }
    else {
        throw new ApiError(constant.MESSAGES.TOGGLE_PARAM_MISSING, httpStatus.BAD_REQUEST)
    }
}

module.exports = toBoolean

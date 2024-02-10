const httpStatus = require('http-status')
const constant = require('../constants')
const ApiError = require('../utils/ApiError')
const sendMail = require('../utils/emailConfig')

exports.sendResetOTP = async ({ name, email, otp }) => {
    try {
        sendMail({
            email,
            subject: constant.MESSAGES.RESET_PASSWORD,
            templateFile: process.env.RESET_PASSWORD_TEMPLATE,
            data: { name, otp },
        })
    } catch (error) {
        Logger.error(`sendResetOTP error => ${error}`)

        throw new ApiError(
            constant.MESSAGES.SOMETHING_WENT_WRONG,
            httpStatus.INTERNAL_SERVER_ERROR
        )
    }
}

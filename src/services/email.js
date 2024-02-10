const path = require('path')
const httpStatus = require('http-status')
const constant = require('../constants')
const ApiError = require('../utils/ApiError')
const sendMail = require('../utils/emailConfig')

exports.sendResetOTP = async ({ name, email, otp }) => {
    try {
        Logger.info(
            `Inside sendResetOTP => name = ${name}, email = ${email}, otp = ${otp}`
        )

        const templateFile = path.join(__dirname, '../views/resetPassword.ejs')

        sendMail({
            email,
            subject: constant.MESSAGES.RESET_PASSWORD,
            templateFile,
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

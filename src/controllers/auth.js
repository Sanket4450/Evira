const httpStatus = require('http-status')
const catchAsyncErrors = require('../utils/catchAsyncErrors')
const authService = require('../services/auth')
const userService = require('../services/user')
const tokenService = require('../services/token')
const sendResponse = require('../utils/responseHandler')

exports.register = catchAsyncErrors(async (req, res) => {
    const body = req.body

    await authService.checkUserWithEmail(body.email)

    const user = await userService.createUser(body)

    const tokens = await tokenService.generateAuthTokens(user._id)

    Logger.info('User signup successfully => '+ body.email)

    return sendResponse(
        res,
        httpStatus.OK,
        { user, tokens },
        'You have signup successfully'
    )
})

exports.login = catchAsyncErrors(async (req, res) => {
    const { email, password } = req.body

    const user = await authService.loginWithEmailAndPassword(email, password)

    const tokens = await tokenService.generateAuthTokens(user._id)

    Logger.info('User login successfully => '+ email)

    return sendResponse(
        res,
        httpStatus.OK,
        { user, tokens },
        'You have logged-in successfully'
    )
})
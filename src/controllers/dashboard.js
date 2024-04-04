const httpStatus = require('http-status')
const catchAsyncErrors = require('../utils/catchAsyncErrors')
const sendResponse = require('../utils/responseHandler')
const ApiError = require('../utils/ApiError')
const constant = require('../constants')
const { userService, orderService } = require('../services/index.service')

exports.getDashboard = catchAsyncErrors(async (req, res) => {

    if (!(await userService.getUserById(req.user.sub))) {
        throw new ApiError(
            constant.MESSAGES.ADMIN_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    const orders = await orderService.getAdminDashboardRevenue(type="completed")

    return sendResponse(
        res,
        httpStatus.OK,
        orders,
        'Dashboard data retrieved successfully'
    )
})

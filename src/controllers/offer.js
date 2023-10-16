const httpStatus = require("http-status");
const catchAsyncErrors = require("../utils/catchAsyncErrors");
const sendResponse = require('../utils/responseHandler')
const {
    offerService
} = require('../services/index.service')

exports.getOffers = catchAsyncErrors(async (req, res) => {
    const specialOffers = await offerService.getAllOffers()

    return sendResponse(
        res,
        httpStatus.OK,
        { specialOffers },
        'Special offers retrieved successfully'
    )
})

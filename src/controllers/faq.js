const httpStatus = require('http-status')
const catchAsyncErrors = require('../utils/catchAsyncErrors')
const sendResponse = require('../utils/responseHandler')
const {
    faqService
} = require('../services/index.service')

exports.getOffers = catchAsyncErrors(async (req, res) => {
    const { page, limit } = req.query

    const specialOffers = await offerService.getOffers({ page, limit })

    return sendResponse(
        res,
        httpStatus.OK,
        { specialOffers },
        'Special offers retrieved successfully'
    )
})

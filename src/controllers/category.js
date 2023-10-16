const httpStatus = require('http-status')
const catchAsyncErrros = require('../utils/catchAsyncErrors')
const sendResponse = require('../utils/responseHandler')
const {
    categoryService
} = require('../services/index.service')

exports.getCategories = catchAsyncErrros(async (req, res) => {
    const categories = await categoryService.getAllCategories()

    return sendResponse(
        res,
        httpStatus.OK,
        { categories },
        'Categories retrieved successfully'
    )
})

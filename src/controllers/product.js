const httpStatus = require('http-status')
const catchAsyncErrors = require('../utils/catchAsyncErrors')
const responseHandler = require('../utils/responseHandler')
const {
    productService
} = require('../services/index.service')

exports.getProducts = catchAsyncErrors(async (req, res) => {
    const { page, limit } = req.query

    const products = await productService.getProducts({ page, limit })

    return responseHandler(
        res,
        httpStatus.OK,
        { products },
        'Products retrieved successfully'
    )
})

exports.getProductsByCategory = catchAsyncErrors(async (req, res) => {
    const { page, limit } = req.query
    const { category } = req.params

    const products = await productService.getProductsByCategory(category, { page, limit })

    return responseHandler(
        res,
        httpStatus.OK,
        { products },
        'Products retrieved successfully'
    )
})
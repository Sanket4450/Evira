const httpStatus = require('http-status')
const catchAsyncErrors = require('../utils/catchAsyncErrors')
const responseHandler = require('../utils/responseHandler')
const ApiError = require('../utils/ApiError')
const constant = require('../constants')
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
    const { categoryId } = req.params

    const products = await productService.getProductsByCategory(categoryId, { page, limit })

    if (!products.length) {
        throw new ApiError(constant.MESSAGES.PRODUCTS_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    return responseHandler(
        res,
        httpStatus.OK,
        { products },
        'Products retrieved successfully'
    )
})

exports.getProductsBySearch = catchAsyncErrors(async (req, res) => {
    const products = await productService.getProductsBySearch(req.query)

    return responseHandler(
        res,
        httpStatus.OK,
        { products },
        'Product retrieved successfully'
    )
})

exports.getProductById = catchAsyncErrors(async (req, res) => {
    const { productId } = req.params

    const [product] = await productService.getProductById(productId)

    if (!product) {
        throw new ApiError(constant.MESSAGES.PRODUCT_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    return responseHandler(
        res,
        httpStatus.OK,
        { product },
        'Product retrieved successfully'
    )
})

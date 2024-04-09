const httpStatus = require('http-status')
const catchAsyncErrros = require('../utils/catchAsyncErrors')
const sendResponse = require('../utils/responseHandler')
const ApiError = require('../utils/ApiError')
const constant = require('../constants')
const { categoryService, userService } = require('../services/index.service')

exports.getCategories = catchAsyncErrros(async (_, res) => {
    let categories = await categoryService.getAllCategories()

    return sendResponse(
        res,
        httpStatus.OK,
        { categories },
        'Categories retrieved successfully'
    )
})

exports.getAdminCategories = catchAsyncErrros(async (req, res) => {
    const { page, limit } = req.query

    if (!(await userService.getUserById(req.user.sub))) {
        throw new ApiError(
            constant.MESSAGES.ADMIN_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    const categories = await categoryService.getAdminCategories({ page, limit })

    return sendResponse(
        res,
        httpStatus.OK,
        { categories },
        'Categories retrieved successfully'
    )
})

exports.postCategory = catchAsyncErrros(async (req, res) => {
    const body = req.body

    if (!(await userService.getUserById(req.user.sub))) {
        throw new ApiError(
            constant.MESSAGES.ADMIN_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    if (await categoryService.getFullCategoryByName(body.name)) {
        throw new ApiError(
            constant.MESSAGES.CATEGORY_NAME_TAKEN,
            httpStatus.CONFLICT
        )
    }

    const category = await categoryService.postCategory(body)

    return sendResponse(
        res,
        httpStatus.OK,
        { category },
        'Category posted successfully'
    )
})

exports.updateCategory = catchAsyncErrros(async (req, res) => {
    const { categoryId } = req.params
    const body = req.body

    if (!(await userService.getUserById(req.user.sub))) {
        throw new ApiError(
            constant.MESSAGES.ADMIN_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    if (!(await categoryService.getCategoryById(categoryId))) {
        throw new ApiError(
            constant.MESSAGES.CATEGORY_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    if (body.name && (await categoryService.getFullCategoryByName(body.name))) {
        throw new ApiError(
            constant.MESSAGES.CATEGORY_NAME_TAKEN,
            httpStatus.CONFLICT
        )
    }

    await categoryService.updateCategory(categoryId, body)

    const category = await categoryService.getFullCategoryById(categoryId)

    return sendResponse(
        res,
        httpStatus.OK,
        { category },
        'Category updated successfully'
    )
})

exports.deleteCategory = catchAsyncErrros(async (req, res) => {
    const { categoryId } = req.params

    if (!(await userService.getUserById(req.user.sub))) {
        throw new ApiError(
            constant.MESSAGES.ADMIN_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    const category = await categoryService.getFullCategoryById(categoryId)

    if (!category) {
        throw new ApiError(
            constant.MESSAGES.CATEGORY_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    await categoryService.deleteCategory(categoryId)

    return sendResponse(
        res,
        httpStatus.OK,
        { category },
        'Category deleted successfully'
    )
})

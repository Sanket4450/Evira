const path = require('path')
const fs = require('fs')
const httpStatus = require('http-status')
const catchAsyncErrors = require('../utils/catchAsyncErrors')
const sendResponse = require('../utils/responseHandler')
const ApiError = require('../utils/ApiError')
const constant = require('../constants')
const {
    productService,
    categoryService,
    offerService,
    userService,
    notificationService,
    storageService,
} = require('../services/index.service')

exports.getHomeData = catchAsyncErrors(async (req, res) => {
    const user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(
            constant.MESSAGES.USER_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    const specialOffers = await offerService.getOffers({ page: 1, limit: 3 })
    const categories = await categoryService.getCategories({})
    let products = await productService.getProducts({ page: 1, limit: 20 })

    products = await productService.validateLikedProducts(user._id, products)

    const unreadNotifications = await notificationService.getUnreadNotifications(user._id)

    const newNotifications = unreadNotifications.length !== 0

    return sendResponse(
        res,
        httpStatus.OK,
        { specialOffers, categories, products, newNotifications },
        'Home data got successfully'
    )
})

exports.uploadFile = catchAsyncErrors(async (req, res) => {
    const { type } = req.body
    const file = req.file

    if (!file) {
      throw new ApiError(constant.MESSAGES.FILE_NOT_FOUND, httpStatus.BAD_REQUEST)
    }

    const extname = path.extname(file.originalname).slice(1)

    const supportedFiles = process.env.SUPPORTED_FILE_TYPES?.split(' ')

    if (!supportedFiles.includes(extname?.toLowerCase())) {
      throw new ApiError(constant.MESSAGES.FILE_TYPE_NOT_SUPPORTED, httpStatus.BAD_REQUEST)
    }

    let folderName

    switch(type) {
        case 'category':
            folderName = constant.FOLDERS.CATEGORY
            break
        case 'product':
            folderName = constant.FOLDERS.PRODUCT
            break
        case 'offer':
            folderName = constant.FOLDERS.OFFER
            break
        case 'user':
            folderName = constant.FOLDERS.USER
            break
        default:
            throw new ApiError(
                constant.MESSAGES.INVALID_TYPE,
                httpStatus.BAD_REQUEST
            )
    }

    const fileName = file.originalname

    const fileBuffer = fs.readFileSync(file.path)

    const url = await storageService.uploadFile(folderName, fileName, fileBuffer)

    return sendResponse(
        res, 
        httpStatus.OK, 
        { url }, 
        'File uploaded successfully')
})

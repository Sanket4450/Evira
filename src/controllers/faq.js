const httpStatus = require('http-status')
const catchAsyncErrors = require('../utils/catchAsyncErrors')
const ApiError = require('../utils/ApiError')
const constant = require('../constants')
const sendResponse = require('../utils/responseHandler')
const {
    faqService,
    userService
} = require('../services/index.service')

exports.getFAQs = catchAsyncErrors(async (req, res) => {
    const { page, limit } = req.query

    const faqs = await faqService.getFAQs({ page, limit })

    return sendResponse(
        res,
        httpStatus.OK,
        { faqs },
        'FAQs retrieved successfully'
    )
})

exports.postFAQ = catchAsyncErrors(async (req, res) => {
  const faq = await faqService.postFAQ(req.body)

  if (!(await userService.getUserById(req.user.sub))) {
    throw new ApiError(constant.MESSAGES.ADMIN_NOT_FOUND, httpStatus.NOT_FOUND)
  }

  return sendResponse(
    res,
    httpStatus.OK,
    { faq },
    'FAQ posted successfully'
  )
})

const httpStatus = require('http-status')
const catchAsyncErrors = require('../utils/catchAsyncErrors')
const ApiError = require('../utils/ApiError')
const constant = require('../constants')
const sendResponse = require('../utils/responseHandler')
const { messageService, userService } = require('../services/index.service')

exports.postMessage = catchAsyncErrors(async (req, res) => {
  const message = await messageService.postMessage(req.body)

  if (!(await userService.getUserById(req.user.sub))) {
    throw new ApiError(constant.MESSAGES.USER_NOT_FOUND, httpStatus.NOT_FOUND)
  }

  return sendResponse(
    res,
    httpStatus.OK,
    { message },
    'Message posted successfully'
  )
})

exports.getMessages = catchAsyncErrors(async (req, res) => {
  const { page, limit } = req.query

  if (!(await userService.getUserById(req.user.sub))) {
    throw new ApiError(constant.MESSAGES.ADMIN_NOT_FOUND, httpStatus.NOT_FOUND)
  }

  const messages = await messageService.getMessages({ page, limit })

  return sendResponse(
    res,
    httpStatus.OK,
    { messages },
    'Messages retrieved successfully'
  )
})

exports.deleteMessage = catchAsyncErrors(async (req, res) => {
  const { faqId } = req.params

  const faq = await faqService.getFullFaqById(faqId)

  if (!(await userService.getUserById(req.user.sub))) {
    throw new ApiError(constant.MESSAGES.ADMIN_NOT_FOUND, httpStatus.NOT_FOUND)
  }

  if (!(await faqService.getFaqById(faqId))) {
    throw new ApiError(constant.MESSAGES.FAQ_NOT_FOUND, httpStatus.NOT_FOUND)
  }

  await faqService.deleteFaqById(faqId)

  return sendResponse(res, httpStatus.OK, { faq }, 'FAQ deleted successfully')
})

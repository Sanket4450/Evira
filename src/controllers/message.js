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
  const { messageId } = req.params

  if (!(await userService.getUserById(req.user.sub))) {
    throw new ApiError(constant.MESSAGES.ADMIN_NOT_FOUND, httpStatus.NOT_FOUND)
  }

  const message = await messageService.getFullMessageById(messageId)

  if (!message) {
    throw new ApiError(constant.MESSAGES.MESSAGE_NOT_FOUND, httpStatus.NOT_FOUND)
  }

  await messageService.deleteMessage(messageId)

  return sendResponse(
    res,
    httpStatus.OK,
    { message },
    'Message deleted successfully'
  )
})

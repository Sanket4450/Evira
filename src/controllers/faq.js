const httpStatus = require('http-status')
const catchAsyncErrors = require('../utils/catchAsyncErrors')
const ApiError = require('../utils/ApiError')
const constant = require('../constants')
const sendResponse = require('../utils/responseHandler')
const { faqService, userService } = require('../services/index.service')

exports.getFaqs = catchAsyncErrors(async (req, res) => {
  const { page, limit } = req.query

  const faqs = await faqService.getFaqs({ page, limit })

  return sendResponse(
    res,
    httpStatus.OK,
    { faqs },
    'FAQs retrieved successfully'
  )
})

exports.getAdminFaqs = catchAsyncErrors(async (req, res) => {
  const { page, limit } = req.query

  if (!(await userService.getUserById(req.user.sub))) {
    throw new ApiError(constant.MESSAGES.ADMIN_NOT_FOUND, httpStatus.NOT_FOUND)
  }

  const faqs = await faqService.getAdminFaqs({ page, limit })

  return sendResponse(
    res,
    httpStatus.OK,
    { faqs },
    'FAQs retrieved successfully'
  )
})

exports.postFaq = catchAsyncErrors(async (req, res) => {
  const body = req.body

  if (!(await userService.getUserById(req.user.sub))) {
    throw new ApiError(constant.MESSAGES.ADMIN_NOT_FOUND, httpStatus.NOT_FOUND)
  }

  if (await faqService.getFaqByTitle(body.title)) {
    throw new ApiError(constant.MESSAGES.FAQ_TITLE_TAKEN, httpStatus.CONFLICT)
  }

  const faq = await faqService.postFaq(body)

  return sendResponse(res, httpStatus.OK, { faq }, 'FAQ posted successfully')
})

exports.updateFaq = catchAsyncErrors(async (req, res) => {
  const { faqId } = req.params
  const body = req.body

  if (!(await userService.getUserById(req.user.sub))) {
    throw new ApiError(constant.MESSAGES.ADMIN_NOT_FOUND, httpStatus.NOT_FOUND)
  }

  if (!(await faqService.getFaqById(faqId))) {
    throw new ApiError(constant.MESSAGES.FAQ_NOT_FOUND, httpStatus.NOT_FOUND)
  }

  if (body.title && (await faqService.getFaqByTitle(body.title))) {
    throw new ApiError(constant.MESSAGES.FAQ_TITLE_TAKEN, httpStatus.CONFLICT)
  }

  await faqService.updateFaq(faqId, body)

  const faq = await faqService.getFullFaqById(faqId)

  return sendResponse(res, httpStatus.OK, { faq }, 'FAQ updated successfully')
})

exports.deleteFaq = catchAsyncErrors(async (req, res) => {
  const { faqId } = req.params

  if (!(await userService.getUserById(req.user.sub))) {
    throw new ApiError(constant.MESSAGES.ADMIN_NOT_FOUND, httpStatus.NOT_FOUND)
  }

  const faq = await faqService.getFullFaqById(faqId)

  if (!faq) {
    throw new ApiError(constant.MESSAGES.FAQ_NOT_FOUND, httpStatus.NOT_FOUND)
  }

  await faqService.deleteFaq(faqId)

  return sendResponse(res, httpStatus.OK, { faq }, 'FAQ deleted successfully')
})

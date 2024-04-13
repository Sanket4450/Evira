const router = require('express').Router()
const adminRouter = require('express').Router()
const { authChecker, authorizeRole } = require('../middlewares/auth')
const faqController = require('../controllers/faq')
const validate = require('../middlewares/validate')
const faqValidation = require('../validations/faq')

router.get('/', validate(faqValidation.getFaqs), faqController.getFaqs)

adminRouter.post(
  '/',
  authChecker,
  authorizeRole('admin'),
  validate(faqValidation.postFaq),
  faqController.postFaq
)

adminRouter.put(
  '/:faqId',
  authChecker,
  authorizeRole('admin'),
  validate(faqValidation.updateFaq),
  faqController.updateFaq
)

adminRouter.delete(
  '/:faqId',
  authChecker,
  authorizeRole('admin'),
  validate(faqValidation.deleteFaq),
  faqController.deleteFaq
)

module.exports = { router, adminRouter }

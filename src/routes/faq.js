const router = require('express').Router()
const adminRouter = require('express').Router()
const { authChecker, authorizeRole } = require('../middlewares/auth')
const faqController = require('../controllers/faq')
const validate = require('../middlewares/validate')
const faqValidation = require('../validations/faq')

router.get('/', validate(faqValidation.getFAQs), faqController.getFAQs)

adminRouter.post(
    '/',
    authChecker,
    authorizeRole('admin'),
    validate(faqValidation.postFAQ),
    faqController.postFAQ
)

module.exports = { router, adminRouter }

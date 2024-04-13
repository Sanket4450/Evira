const router = require('express').Router()
const adminRouter = require('express').Router()
const { authChecker, authorizeRole } = require('../middlewares/auth')
const messageController = require('../controllers/message')
const validate = require('../middlewares/validate')
const messageValidation = require('../validations/message')

router.post(
  '/',
  authChecker,
  validate(messageValidation.postMessage),
  messageController.postMessage
)

adminRouter.get(
  '/',
  authChecker,
  authorizeRole('admin'),
  validate(messageValidation.getMessages),
  messageController.getMessages
)

// adminRouter.delete(
//   '/',
//   authChecker,
//   authorizeRole('admin'),
//   validate(messageValidation.deleteMessages),
//   messageController.deleteMessages
// )

module.exports = { router, adminRouter }

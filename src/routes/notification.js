const router = require('express').Router()
const validate = require('../middlewares/validate')
const notificationValidation = require('../validations/notification')
const notificationController = require('../controllers/notification')
const authChecker = require('../middlewares/auth')

router.get('/', authChecker, validate(notificationValidation.getNotifications), notificationController.getNotifications)

module.exports = router
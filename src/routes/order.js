const router = require('express').Router()
const authChecker = require('../middlewares/auth')
const orderController = require('../controllers/order')
const validate = require('../middlewares/validate')
const orderValidation = require('../validations/order')

router.get('/track/:orderId', authChecker, validate(orderValidation.trackOrder), orderController.trackOrder)

router.get('/:type', authChecker, validate(orderValidation.getOrders), orderController.getOrders)

module.exports = router

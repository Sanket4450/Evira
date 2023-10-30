const router = require('express').Router()
const adminRouter = require('express').Router()
const { authChecker, authorizeRole } = require('../middlewares/auth')
const orderController = require('../controllers/order')
const validate = require('../middlewares/validate')
const orderValidation = require('../validations/order')

router.get('/track/:orderId', authChecker, validate(orderValidation.trackOrder), orderController.trackOrder)

router.get('/:type', authChecker, validate(orderValidation.getOrders), orderController.getOrders)

router.put('/cancel/:orderId', authChecker, validate(orderValidation.cancelOrder), orderController.cancelOrder)

adminRouter.get('/', authChecker, authorizeRole('admin'), validate(orderValidation.getAdminOrders), orderController.getAdminOrders)

adminRouter.get('/:orderId', authChecker, authorizeRole('admin'), validate(orderValidation.getAdminOrder), orderController.getAdminOrder)

adminRouter.put('/:orderId', authChecker, authorizeRole('admin'), validate(orderValidation.updateOrder), orderController.updateOrder)

module.exports = { router, adminRouter }

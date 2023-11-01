const adminRouter = require('express').Router()
const validate = require('../middlewares/validate')
const shippingValidation = require('../validations/shipping')
const shippingController = require('../controllers/shipping')
const { authChecker, authorizeRole } = require('../middlewares/auth')

adminRouter.get('/', authChecker, authorizeRole('admin'), shippingController.getAdminShippingTypes)

adminRouter.post('/', authChecker, authorizeRole('admin'), validate(shippingValidation.postShippingType), shippingController.postShippingType)

adminRouter.put('/:shippingId', authChecker, authorizeRole('admin'), validate(shippingValidation.updateShippingType), shippingController.updateShippingType)

adminRouter.delete('/:shippingId', authChecker, authorizeRole('admin'), validate(shippingValidation.deleteShippingType), shippingController.deleteShippingType)

module.exports = adminRouter

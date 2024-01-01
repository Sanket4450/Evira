const adminRouter1 = require('express').Router()
const adminRouter2 = require('express').Router()
const validate = require('../middlewares/validate')
const productValidation = require('../validations/product')
const productController = require('../controllers/product')
const { authChecker, authorizeRole } = require('../middlewares/auth')

adminRouter1.get('/variants/:productId', authChecker, authorizeRole('admin'), validate(productValidation.getVariants), productController.getVariants)

adminRouter1.post('/variants/:productId', authChecker, authorizeRole('admin'), validate(productValidation.postVariant), productController.postVariant)

adminRouter2.put('/:variantId', authChecker, authorizeRole('admin'), validate(productValidation.updateVariant), productController.updateVariant)

adminRouter2.delete('/:variantId', authChecker, authorizeRole('admin'), validate(productValidation.deleteVariant), productController.deleteVariant)

module.exports = {
    adminRouter1,
    adminRouter2
}

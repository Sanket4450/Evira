const router = require('express').Router()
const validate = require('../middlewares/validate')
const productValidation = require('../validations/product')
const productController = require('../controllers/product')

router.get('/', validate(productValidation.getProducts), productController.getProducts)

router.get('/:category', validate(productValidation.getProductsByCategory), productController.getProductsByCategory)

module.exports = router
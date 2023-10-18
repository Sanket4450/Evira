const router = require('express').Router()
const validate = require('../middlewares/validate')
const productValidation = require('../validations/product')
const productController = require('../controllers/product')

router.get('/', validate(productValidation.getProducts), productController.getProducts)

router.get('/category/:categoryId', validate(productValidation.getProductsByCategory), productController.getProductsByCategory)

router.get('/search', validate(productValidation.getProductsBySearch), productController.getProductsBySearch)

router.get('/:productId', validate(productValidation.getProductById), productController.getProductById)

module.exports = router

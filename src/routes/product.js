const router1 = require('express').Router()
const router2 = require('express').Router()
const router3 = require('express').Router()
const validate = require('../middlewares/validate')
const productValidation = require('../validations/product')
const productController = require('../controllers/product')
const authChecker = require('../middlewares/auth')

router1.get('/', validate(productValidation.getProducts), productController.getProducts)

router1.get('/category/:categoryId', validate(productValidation.getProductsByCategory), productController.getProductsByCategory)

router1.get('/search', validate(productValidation.getProductsBySearch), productController.getProductsBySearch)

router1.get('/:productId', validate(productValidation.getFullProductById), productController.getFullProductById)

router1.patch('/:productId/toggle-like', authChecker, validate(productValidation.toggleLike), productController.toggleLike)

router2.get('/', authChecker, validate(productValidation.getProducts), productController.getWishlistProducts)

router2.get('/category/:categoryId', authChecker, validate(productValidation.getProductsByCategory), productController.getWishlistProductsByCategory)

router2.get('/search', authChecker, validate(productValidation.getProductsBySearch), productController.getWishlistProductsBySearch)

router3.patch('/:productId/toggle-cart', authChecker, validate(productValidation.toggleCart), productController.toggleCart)

router3.get('/', authChecker, validate(productValidation.getProducts), productController.getCartProducts)

router3.get('/search', authChecker, validate(productValidation.searchWithOnlyKeyword), productController.getCartProductsBySearch)

module.exports = {
    router1,
    router2,
    router3
}

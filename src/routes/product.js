const router1 = require('express').Router()
const router2 = require('express').Router()
const router3 = require('express').Router()
const adminRouter = require('express').Router()
const validate = require('../middlewares/validate')
const productValidation = require('../validations/product')
const productController = require('../controllers/product')
const { authChecker, authorizeRole } = require('../middlewares/auth')

router1.get(
    '/',
    authChecker,
    validate(productValidation.getProducts),
    productController.getProducts
)

router1.get(
    '/category/:categoryId',
    authChecker,
    validate(productValidation.getProductsByCategory),
    productController.getProductsByCategory
)

router1.get(
    '/search',
    authChecker,
    validate(productValidation.getProductsBySearch),
    productController.getProductsBySearch
)

router1.get(
    '/:productId',
    authChecker,
    validate(productValidation.getFullProductById),
    productController.getFullProductById
)

router1.patch(
    '/toggle-like/:productId',
    authChecker,
    validate(productValidation.toggleLike),
    productController.toggleLike
)

router2.get(
    '/',
    authChecker,
    validate(productValidation.getProducts),
    productController.getWishlistProducts
)

router2.get(
    '/category/:categoryId',
    authChecker,
    validate(productValidation.getProductsByCategory),
    productController.getWishlistProductsByCategory
)

router2.get(
    '/search',
    authChecker,
    validate(productValidation.getProductsBySearch),
    productController.getWishlistProductsBySearch
)

router3.put(
    '/toggle-cart',
    authChecker,
    validate(productValidation.toggleCart),
    productController.toggleCart
)

router3.get('/', authChecker, productController.getCartProducts)

adminRouter.get(
    '/',
    authChecker,
    authorizeRole('admin'),
    validate(productValidation.getAdminProducts),
    productController.getAdminProducts
)

adminRouter.get(
    '/:productId',
    authChecker,
    authorizeRole('admin'),
    validate(productValidation.getFullProductById),
    productController.getAdminFullProductById
)

adminRouter.post(
    '/',
    authChecker,
    authorizeRole('admin'),
    validate(productValidation.postProduct),
    productController.postProduct
)

adminRouter.put(
    '/:productId',
    authChecker,
    authorizeRole('admin'),
    validate(productValidation.updateProduct),
    productController.updateProduct
)

adminRouter.delete(
    '/:productId',
    authChecker,
    authorizeRole('admin'),
    validate(productValidation.deleteProduct),
    productController.deleteProduct
)

module.exports = {
    router1,
    router2,
    router3,
    adminRouter,
}

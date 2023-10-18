const router = require('express').Router()
const validate = require('../middlewares/validate')
const productValidation = require('../validations/product')
const wishlistController = require('../controllers/wishlist')
const authChecker = require('../middlewares/auth')

router.get('/', authChecker, validate(productValidation.getProducts), wishlistController.getProducts)

module.exports = router
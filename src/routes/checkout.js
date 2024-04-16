const router = require('express').Router()
const { authChecker } = require('../middlewares/auth')
const validate = require('../middlewares/validate')
const checkoutValidation = require('../validations/checkout')
const checkoutController = require('../controllers/checkout')

router.get('/shipping-types', checkoutController.getShippingTypes)

router.get('/promo-codes', checkoutController.getPromoCodes)

router.post(
    '/',
    authChecker,
    validate(checkoutValidation.postCheckout),
    checkoutController.postCheckout
)

module.exports = router

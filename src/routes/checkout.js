const router = require('express').Router()
const authChecker = require('../middlewares/auth')
const validate = require('../middlewares/validate')
const checkoutValidation = require('../validations/checkout')
const checkoutController = require('../controllers/checkout')

router.post('/', authChecker, validate(checkoutValidation.postCheckout), checkoutController.postCheckout)

router.get('/shipping-types', checkoutController.getShippingTypes)

router.get('/promo-codes', checkoutController.getPromoCodes)

router.post('/promo-code/:promoId', authChecker, validate(checkoutValidation.addPromoCode), checkoutController.addPromoCode)

router.get('/payment-methods', authChecker, checkoutController.getPaymentMethods)

module.exports = router

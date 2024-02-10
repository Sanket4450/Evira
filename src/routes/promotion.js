const adminRouter = require('express').Router()
const validate = require('../middlewares/validate')
const promotionValidation = require('../validations/promotion')
const promotionController = require('../controllers/promotion')
const { authChecker, authorizeRole } = require('../middlewares/auth')

adminRouter.get(
    '/',
    authChecker,
    authorizeRole('admin'),
    validate(promotionValidation.getAdminPromoCodes),
    promotionController.getAdminPromoCodes
)

adminRouter.post(
    '/',
    authChecker,
    authorizeRole('admin'),
    validate(promotionValidation.postPromoCode),
    promotionController.postPromoCode
)

adminRouter.put(
    '/:promoId',
    authChecker,
    authorizeRole('admin'),
    validate(promotionValidation.updatePromoCode),
    promotionController.updatePromoCode
)

adminRouter.delete(
    '/:promoId',
    authChecker,
    authorizeRole('admin'),
    validate(promotionValidation.deletePromoCode),
    promotionController.deletePromoCode
)

module.exports = adminRouter

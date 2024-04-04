const router = require('express').Router()
const adminRouter = require('express').Router()
const { authChecker, authorizeRole } = require('../middlewares/auth')
const offerController = require('../controllers/offer')
const validate = require('../middlewares/validate')
const offerValidation = require('../validations/offer')

router.get('/', validate(offerValidation.getOffers), offerController.getOffers)

adminRouter.get(
    '/:productId',
    authChecker,
    authorizeRole('admin'),
    validate(offerValidation.getProductOffers),
    offerController.getProductOffers
)

adminRouter.post(
    '/',
    authChecker,
    authorizeRole('admin'),
    validate(offerValidation.postOffer),
    offerController.postOffer
)

adminRouter.put(
    '/:offerId',
    authChecker,
    authorizeRole('admin'),
    validate(offerValidation.updateOffer),
    offerController.updateOffer
)

adminRouter.delete(
    '/:offerId',
    authChecker,
    authorizeRole('admin'),
    validate(offerValidation.deleteOffer),
    offerController.deleteOffer
)

module.exports = { router, adminRouter }

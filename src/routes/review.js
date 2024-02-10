const router1 = require('express').Router()
const router2 = require('express').Router()
const adminRouter = require('express').Router()
const validate = require('../middlewares/validate')
const reviewValidation = require('../validations/review')
const reviewController = require('../controllers/review')
const { authChecker, authorizeRole } = require('../middlewares/auth')

router1.get(
    '/reviews/:productId',
    validate(reviewValidation.getReviews),
    reviewController.getReviews
)

router1.post(
    '/reviews/:productId',
    authChecker,
    validate(reviewValidation.postReview),
    reviewController.postReview
)

router1.get(
    '/reviews/search/:productId',
    validate(reviewValidation.getReviewsBySearch),
    reviewController.getReviewsBySearch
)

router2.put(
    '/:reviewId',
    authChecker,
    validate(reviewValidation.updateReview),
    reviewController.updateReview
)

router2.delete(
    '/:reviewId',
    authChecker,
    validate(reviewValidation.deleteReview),
    reviewController.deleteReview
)

router2.patch(
    '/toggle-like/:reviewId',
    authChecker,
    validate(reviewValidation.toggleLike),
    reviewController.toggleLike
)

adminRouter.delete(
    '/:reviewId',
    authChecker,
    authorizeRole('admin'),
    validate(reviewValidation.deleteReview),
    reviewController.deleteAdminReview
)

module.exports = {
    router1,
    router2,
    adminRouter,
}

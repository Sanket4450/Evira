const router = require('express').Router()
const rootRoutes = require('./root')
const authRoutes = require('./auth')
const userRoutes = require('./user')
const productRoutes = require('./product')
const offerRoutes = require('./offer')
const categoryRoutes = require('./category')
const notificationRoutes = require('./notification')
const wishlistRoutes = require('./wishlist')
const productReviewRoutes = require('./review').router1
const reviewRoutes = require('./review').router2

router.use('/', rootRoutes)
router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/products', productRoutes)
router.use('/offers', offerRoutes)
router.use('/categories', categoryRoutes)
router.use('/notifications', notificationRoutes)
router.use('/products/wishlist', wishlistRoutes)
router.use('/products', productReviewRoutes)
router.use('/reviews', reviewRoutes)

module.exports = router

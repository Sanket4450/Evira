const router = require('express').Router()
const rootRoutes = require('./root')
const authRoutes = require('./auth')
const userRoutes = require('./user')
const productRoutes = require('./product').router1
const wishlistProductRoutes = require('./product').router2
const cartProductRoutes = require('./product').router3
const offerRoutes = require('./offer')
const categoryRoutes = require('./category')
const notificationRoutes = require('./notification')
const productReviewRoutes = require('./review').router1
const reviewRoutes = require('./review').router2
const checkoutRoutes = require('./checkout')

router.use('/', rootRoutes)
router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/products/wishlist', wishlistProductRoutes)
router.use('/products/cart', cartProductRoutes)
router.use('/products', productRoutes)
router.use('/offers', offerRoutes)
router.use('/categories', categoryRoutes)
router.use('/notifications', notificationRoutes)
router.use('/products', productReviewRoutes)
router.use('/reviews', reviewRoutes)
router.use('/checkout', checkoutRoutes)

module.exports = router

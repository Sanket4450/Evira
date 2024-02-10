const userRouter = require('express').Router()
const adminRouter = require('express').Router()
const rootRoutes = require('./root')
const authRoutes = require('./auth')
const userRoutes = require('./user').router
const adminUserRoutes = require('./user').adminRouter
const productRoutes = require('./product').router1
const wishlistProductRoutes = require('./product').router2
const cartProductRoutes = require('./product').router3
const adminProductRoutes = require('./product').adminRouter
const adminProductVariantRoutes = require('./variant').adminRouter1
const adminVariantRoutes = require('./variant').adminRouter2
const offerRoutes = require('./offer').router
const adminOfferRoutes = require('./offer').adminRouter
const categoryRoutes = require('./category').router
const adminCategoryRoutes = require('./category').adminRouter
const notificationRoutes = require('./notification')
const productReviewRoutes = require('./review').router1
const reviewRoutes = require('./review').router2
const adminReviewRoutes = require('./review').adminRouter
const checkoutRoutes = require('./checkout')
const adminShippingRoutes = require('./shipping')
const adminPromotionRoutes = require('./promotion')
const orderRoutes = require('./order').router
const adminOrderRoutes = require('./order').adminRouter

userRouter.use('/', rootRoutes)
userRouter.use('/auth', authRoutes)
userRouter.use('/users', userRoutes)
userRouter.use('/products/wishlist', wishlistProductRoutes)
userRouter.use('/products/cart', cartProductRoutes)
userRouter.use('/products', productRoutes)
userRouter.use('/offers', offerRoutes)
userRouter.use('/categories', categoryRoutes)
userRouter.use('/notifications', notificationRoutes)
userRouter.use('/products', productReviewRoutes)
userRouter.use('/reviews', reviewRoutes)
userRouter.use('/checkout', checkoutRoutes)
userRouter.use('/orders', orderRoutes)

adminRouter.use('/users', adminUserRoutes)
adminRouter.use('/products', adminProductRoutes)
adminRouter.use('/categories', adminCategoryRoutes)
adminRouter.use('/products', adminProductVariantRoutes)
adminRouter.use('/variants', adminVariantRoutes)
adminRouter.use('/offers', adminOfferRoutes)
adminRouter.use('/reviews', adminReviewRoutes)
adminRouter.use('/shipping', adminShippingRoutes)
adminRouter.use('/promo', adminPromotionRoutes)
adminRouter.use('/orders', adminOrderRoutes)

module.exports = {
    userRoutes: userRouter,
    adminRoutes: adminRouter,
}

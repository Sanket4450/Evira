const router = require('express').Router()
const rootRoutes = require('./root')
const authRoutes = require('./auth')
const userRoutes = require('./user')

router.use('/', rootRoutes)
router.use('/auth', authRoutes)
router.use('/users', userRoutes)

module.exports = router
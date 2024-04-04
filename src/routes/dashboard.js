const router = require('express').Router()
const { authChecker, authorizeRole } = require('../middlewares/auth')
const dashboardController = require('../controllers/dashboard')

router.get(
    '/',
    authChecker,
    authorizeRole('admin'),
    dashboardController.getDashboard
)

module.exports = router

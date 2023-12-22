const router = require('express').Router()
const rootController = require('../controllers/root')
const { authChecker } = require('../middlewares/auth')

router.get('/home', authChecker, rootController.getHomeData)

module.exports = router

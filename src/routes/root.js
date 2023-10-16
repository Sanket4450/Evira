const router = require('express').Router()
const rootController = require('../controllers/root')

router.get('/home', rootController.getHomeData)

module.exports = router

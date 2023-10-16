const router = require('express').Router()
const offerController = require('../controllers/offer')

router.get('/', offerController.getOffers)

module.exports = router

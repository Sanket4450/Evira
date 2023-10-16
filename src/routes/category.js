const router = require('express').Router()
const categoryController = require('../controllers/category')

router.get('/', categoryController.getCategories)

module.exports = router

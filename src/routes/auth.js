const router = require('express').Router()
const validate = require('../middlewares/validate')
const authValidation = require('../validations/auth')
const authController = require('../controllers/auth')

router.post('/register', validate(authValidation.register), authController.register)

router.post('/login', validate(authValidation.login), authController.login)

module.exports = router
const router = require('express').Router()
const validate = require('../middlewares/validate')
const userValidation = require('../validations/user')
const userController = require('../controllers/user')
const authChecker = require('../middlewares/auth')

router.get('/profile', authChecker, userController.getProfile)

router.put('/profile', authChecker, validate(userValidation.profile), userController.updateProfile)

router.delete('/profile', authChecker, userController.deleteProfile)

router.patch('/toggle-notifications', authChecker, validate(userValidation.toggleNotifications), userController.toggleNotifications)

router.get('/addresses', authChecker, userController.getAddresses)

router.post('/addresses', authChecker, validate(userValidation.postAddress), userController.postAddress)

router.put('/addresses/:addressId', authChecker, validate(userValidation.updateAddress), userController.updateAddress)

router.delete('/addresses/:addressId', authChecker, validate(userValidation.deleteAddress), userController.deleteAddress)

module.exports = router

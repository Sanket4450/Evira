const router = require('express').Router()
const adminRouter = require('express').Router()
const validate = require('../middlewares/validate')
const userValidation = require('../validations/user')
const userController = require('../controllers/user')
const { authChecker, authorizeRole } = require('../middlewares/auth')

router.post('/profile', authChecker, validate(userValidation.postProfile), userController.postProfile)

router.get('/profile', authChecker, userController.getProfile)

router.put('/profile', authChecker, validate(userValidation.updateprofile), userController.updateProfile)

router.delete('/profile', authChecker, userController.deleteProfile)

router.patch('/toggle-notifications', authChecker, validate(userValidation.toggleNotifications), userController.toggleNotifications)

router.get('/addresses', authChecker, userController.getAddresses)

router.post('/addresses', authChecker, validate(userValidation.postAddress), userController.postAddress)

router.put('/addresses/:addressId', authChecker, validate(userValidation.updateAddress), userController.updateAddress)

router.delete('/addresses/:addressId', authChecker, validate(userValidation.deleteAddress), userController.deleteAddress)

adminRouter.get('/', authChecker, authorizeRole('admin'), validate(userValidation.getUsers), userController.getUsers)

adminRouter.get('/:userId', authChecker, authorizeRole('admin'), validate(userValidation.getUser), userController.getUser)

adminRouter.put('/:userId', authChecker, authorizeRole('admin'), validate(userValidation.updateUser), userController.updateUser)

adminRouter.delete('/:userId', authChecker, authorizeRole('admin'), validate(userValidation.deleteUser), userController.deleteUser)

module.exports = { router, adminRouter }

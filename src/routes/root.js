const router = require('express').Router()
const adminRouter = require('express').Router()
const rootValidation = require('../validations/root')
const rootController = require('../controllers/root')
const { authChecker, authorizeRole } = require('../middlewares/auth')
const validate = require('../middlewares/validate')
const { uploadFile } = require('../middlewares/multer')

router.get('/home', authChecker, rootController.getHomeData)

router.post('/upload', authChecker, uploadFile, validate(rootValidation.uploadFile), rootController.uploadFile)

adminRouter.post('/upload', authChecker, authorizeRole('admin'), uploadFile, validate(rootValidation.uploadFile), rootController.uploadFile)

module.exports = { router, adminRouter }

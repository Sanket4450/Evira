const router = require('express').Router()
const adminRouter = require('express').Router()
const categoryController = require('../controllers/category')
const validate = require('../middlewares/validate')
const categoryValidation = require('../validations/category')
const { authChecker, authorizeRole } = require('../middlewares/auth')

router.get('/', categoryController.getCategories)

adminRouter.get('/', authChecker, authorizeRole('admin'), validate(categoryValidation.getAdminCategories), categoryController.getAdminCategories)

adminRouter.post('/', authChecker, authorizeRole('admin'), validate(categoryValidation.postCategory), categoryController.postCategory)

adminRouter.put('/:categoryId', authChecker, authorizeRole('admin'), validate(categoryValidation.updateCategory), categoryController.updateCategory)

adminRouter.delete('/:categoryId', authChecker, authorizeRole('admin'), validate(categoryValidation.deleteCategory), categoryController.deleteCategory)

module.exports = { router, adminRouter }

const joi = require('joi')

const {
    idReqValidation,
    stringReqValidation,
    stringValidation,
    pageAndLimit,
} = require('./common')

const getAdminCategories = {
    query: joi.object().keys({
        ...pageAndLimit,
    }),
}

const postCategory = {
    body: joi.object().keys({
        name: stringReqValidation.max(20),
        icon: stringValidation,
        description: stringValidation.max(200),
    }),
}

const updateCategory = {
    params: {
        categoryId: idReqValidation,
    },
    body: joi.object().keys({
        name: stringValidation.max(20),
        icon: stringValidation,
        description: stringValidation.max(200),
    }),
}

const deleteCategory = {
    params: {
        categoryId: idReqValidation,
    },
}

module.exports = {
    getAdminCategories,
    postCategory,
    updateCategory,
    deleteCategory,
}

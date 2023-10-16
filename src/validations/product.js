const joi = require('joi')
const {
    pageAndLimit,
    idValidation
} = require('./common')

const getProducts = {
    query: joi.object().keys({
        ...pageAndLimit
    })
}

const getProductsByCategory = {
    query: joi.object().keys({
        ...pageAndLimit
    }),
    params: joi.object().keys({
        categoryId: idValidation
    })
}

const getProductById = {
    params: joi.object().keys({
        productId: idValidation
    })
}

module.exports = {
    getProducts,
    getProductsByCategory,
    getProductById
}

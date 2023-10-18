const joi = require('joi')
const {
    pageAndLimit,
    idValidation,
    stringReqValidation,
    integerNumberValidation,
    stringValidation
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

const getProductsBySearch = {
    query: joi.object().keys({
        keyword: stringReqValidation.label('Search Keyword'),
        category: stringValidation,
        min_price: integerNumberValidation,
        max_price: integerNumberValidation,
        sortBy: stringReqValidation.valid('popular', 'recent', 'price_desc', 'price_asc'),
        rating: integerNumberValidation.valid(1, 2, 3, 4, 5)
    })
}

module.exports = {
    getProducts,
    getProductsByCategory,
    getProductById,
    getProductsBySearch
}

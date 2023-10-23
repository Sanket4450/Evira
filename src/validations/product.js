const joi = require('joi')

const {
    pageAndLimit,
    idValidation,
    stringReqValidation,
    integerNumberValidation,
    stringValidation,
    toggleValidation
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

const getFullProductById = {
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
        rating: integerNumberValidation.valid(1, 2, 3, 4, 5),
        ...pageAndLimit
    })
}
  
const toggleLike = {
    params: joi.object().keys({
        productId: idValidation
    }),
    query: joi.object().keys({
        like: toggleValidation
    })
}

const toggleCart = {
    params: joi.object().keys({
        productId: idValidation
    }),
    query: joi.object().keys({
        action: stringReqValidation.valid('add', 'remove', 'increase', 'decrease'),
        quantity: integerNumberValidation.min(0)
    })
}

const searchWithOnlyKeyword = {
    query: joi.object().keys({
        keyword: stringReqValidation.label('Search Keyword'),
        ...pageAndLimit
    })
}

module.exports = {
    getProducts,
    getProductsByCategory,
    getFullProductById,
    getProductsBySearch,
    toggleLike,
    toggleCart,
    searchWithOnlyKeyword
}

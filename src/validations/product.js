const joi = require('joi')

const {
    pageAndLimit,
    idReqValidation,
    stringReqValidation,
    integerNumberValidation,
    stringValidation,
    toggleValidation,
    numberReqValidation,
    integerNumberReqValidation,
    numberValidation,
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
        categoryId: idReqValidation
    })
}

const getFullProductById = {
    params: joi.object().keys({
        productId: idReqValidation
    })
}

const getProductsBySearch = {
    query: joi.object().keys({
        keyword: stringReqValidation.label('Search Keyword'),
        category: stringValidation,
        min_price: integerNumberValidation,
        max_price: integerNumberValidation,
        sortBy: stringReqValidation.lowercase().valid('popular', 'recent', 'price_desc', 'price_asc'),
        rating: integerNumberValidation.valid(1, 2, 3, 4, 5),
        ...pageAndLimit
    })
}

const toggleLike = {
    params: joi.object().keys({
        productId: idReqValidation
    }),
    query: joi.object().keys({
        like: toggleValidation
    })
}

const toggleCart = {
    params: joi.object().keys({
        productId: idReqValidation
    }),
    query: joi.object().keys({
        action: stringReqValidation.lowercase().valid('add', 'remove', 'increase', 'decrease'),
        variant: stringValidation
            .pattern(new RegExp('^[0-9a-fA-F]{24}$'))
            .messages({ 'string.pattern.base': 'Invalid ID. Please provide a valid ObjectId' }),
        quantity: integerNumberValidation.min(0)
    })
}

const searchWithOnlyKeyword = {
    query: joi.object().keys({
        keyword: stringReqValidation.label('Search Keyword')
    })
}

const getVariants = {
    params: joi.object().keys({
        productId: idReqValidation
    })
}

const postVariant = {
    params: joi.object().keys({
        productId: idReqValidation
    }),
    body: joi.object().keys({
        name: stringValidation.max(30),
        size: [stringValidation, integerNumberValidation],
        color: stringValidation,
        price: numberReqValidation.precision(2),
        quantity: integerNumberValidation
    })
}

const updateVariant = {
    params: joi.object().keys({
        variantId: idReqValidation
    }),
    body: joi.object().keys({
        name: stringValidation.max(30),
        size: [stringValidation, integerNumberValidation],
        color: stringValidation,
        price: numberValidation.precision(2),
        quantity: integerNumberValidation
    })
}

const deleteVariant = {
    params: joi.object().keys({
        variantId: idReqValidation
    })
}

const postProduct = {
    body: joi.object().keys({
        name: stringReqValidation.max(80),
        image: stringValidation,
        description: stringValidation,
        category: idReqValidation,
        price: numberReqValidation.precision(2),
        quantity: integerNumberReqValidation,
        defaultVariant: {
            name: stringValidation.max(30),
            size: [stringValidation, integerNumberValidation],
            color: stringValidation,
            price: numberValidation.precision(2),
            quantity: integerNumberValidation
        }
    })
}

const updateProduct = {
    params: joi.object().keys({
        productId: idReqValidation
    }),
    body: joi.object().keys({
        name: stringValidation.max(80),
        image: stringValidation,
        description: stringValidation,
        category: idValidation,
        price: numberValidation.precision(2),
        quantity: integerNumberValidation,
        defaultVariant: idValidation
    })
}

const deleteProduct = {
    params: joi.object().keys({
        productId: idReqValidation
    })
}

module.exports = {
    getProducts,
    getProductsByCategory,
    getFullProductById,
    getProductsBySearch,
    toggleLike,
    toggleCart,
    searchWithOnlyKeyword,
    getVariants,
    postVariant,
    updateVariant,
    deleteVariant,
    postProduct,
    updateProduct,
    deleteProduct,
}

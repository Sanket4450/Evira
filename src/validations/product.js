const joi = require('joi')

const {
    pageAndLimit,
    idReqValidation,
    stringReqValidation,
    integerNumberValidation,
    stringValidation,
    numberReqValidation,
    integerNumberReqValidation,
    numberValidation,
    idValidation,
    booleanValidation
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
        category: idValidation,
        min_price: numberValidation.precision(2),
        max_price: numberValidation.precision(2),
        sortBy: stringReqValidation.lowercase().valid('popular', 'recent', 'price_desc', 'price_asc'),
        rating: integerNumberValidation.valid(1, 2, 3, 4, 5),
        ...pageAndLimit
    })
}

const toggleLike = {
    params: joi.object().keys({
        productId: idReqValidation
    }),
    body: joi.object().keys({
        isLiked: booleanValidation
    })
}

const toggleCart = {
    params: joi.object().keys({
        productId: idReqValidation
    }),
    body: joi.object().keys({
        action: stringReqValidation.lowercase().valid('add', 'remove', 'increase', 'decrease'),
        variant: idValidation,
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
        quantity: integerNumberReqValidation
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
        defaultVariant: joi.object().keys({
            name: stringValidation.max(30),
            size: [stringValidation, integerNumberValidation],
            color: stringValidation,
            price: numberValidation.precision(2),
            quantity: integerNumberValidation
        })
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

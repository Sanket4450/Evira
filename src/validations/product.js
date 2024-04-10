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
    booleanReqValidation,
} = require('./common')

const getProducts = {
    query: joi.object().keys({
        ...pageAndLimit,
    }),
}

const getProductsByCategory = {
    query: joi.object().keys({
        ...pageAndLimit,
    }),
    params: joi.object().keys({
        categoryId: idReqValidation,
    }),
}

const getFullProductById = {
    params: joi.object().keys({
        productId: idReqValidation,
    }),
}

const getProductsBySearch = {
    query: joi.object().keys({
        keyword: stringValidation.label('Search Keyword'),
        category: idValidation,
        min_price: numberValidation.precision(2),
        max_price: numberValidation.precision(2),
        sortBy: stringValidation
            .lowercase()
            .valid('popular', 'recent', 'price_desc', 'price_asc'),
        rating: integerNumberValidation.valid(1, 2, 3, 4, 5),
        ...pageAndLimit,
    }),
}

const getAdminProducts = {
    query: joi.object().keys({
        keyword: stringValidation.label('Search Keyword'),
        category: idValidation,
        min_price: numberValidation.precision(2),
        max_price: numberValidation.precision(2),
        rating: integerNumberValidation.valid(1, 2, 3, 4, 5),
        ...pageAndLimit,
    }),
}

const toggleLike = {
    params: joi.object().keys({
        productId: idReqValidation,
    }),
    body: joi.object().keys({
        isLiked: booleanReqValidation,
    }),
}

const toggleCart = {
    body: joi.object().keys({
        productId: idReqValidation,
        variantId: idReqValidation,
        action: stringReqValidation
            .lowercase()
            .valid('add', 'remove', 'increase', 'decrease'),
        quantity: integerNumberValidation.min(0),
    }),
}

const searchWithOnlyKeyword = {
    query: joi.object().keys({
        keyword: stringReqValidation.label('Search Keyword'),
    }),
}

const getVariants = {
    params: joi.object().keys({
        productId: idReqValidation,
    }),
}

const postVariant = {
    params: joi.object().keys({
        productId: idReqValidation,
    }),
    body: joi.object().keys({
        size: [stringValidation, integerNumberValidation],
        color: stringValidation,
        price: numberReqValidation.precision(2),
        quantity: integerNumberReqValidation,
    }),
}

const updateVariant = {
    params: joi.object().keys({
        variantId: idReqValidation,
    }),
    body: joi.object().keys({
        size: [stringValidation, integerNumberValidation],
        color: stringValidation,
        price: numberValidation.precision(2),
        quantity: integerNumberValidation,
    }),
}

const deleteVariant = {
    params: joi.object().keys({
        variantId: idReqValidation,
    }),
}

const postProduct = {
    body: joi.object().keys({
        name: stringReqValidation.max(80),
        image: stringValidation,
        imageFile: stringValidation,
        description: stringValidation,
        category: idReqValidation,
        defaultVariant: {
            size: [stringValidation, integerNumberValidation],
            color: stringValidation,
            price: numberReqValidation.precision(2),
            quantity: integerNumberReqValidation,
        }
    }),
}

const updateProduct = {
    params: joi.object().keys({
        productId: idReqValidation,
    }),
    body: joi.object().keys({
        name: stringValidation.max(80),
        image: stringValidation,
        imageFile: stringValidation,
        description: stringValidation,
        category: idValidation,
        sold: integerNumberValidation
    }),
}

const deleteProduct = {
    params: joi.object().keys({
        productId: idReqValidation,
    }),
}

module.exports = {
    getProducts,
    getProductsByCategory,
    getFullProductById,
    getProductsBySearch,
    getAdminProducts,
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

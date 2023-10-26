const httpStatus = require('http-status')
const catchAsyncErrors = require('../utils/catchAsyncErrors')
const sendResponse = require('../utils/responseHandler')
const ApiError = require('../utils/ApiError')
const constant = require('../constants')
const toBoolean = require('../utils/checkBoolean')
const {
    productService,
    userService,
    wishlistService,
    cartService
} = require('../services/index.service')

exports.getProducts = catchAsyncErrors(async (req, res) => {
    const { page, limit } = req.query

    const products = await productService.getProducts({ page, limit })

    return sendResponse(
        res,
        httpStatus.OK,
        { products },
        'Products retrieved successfully'
    )
})

exports.getProductsByCategory = catchAsyncErrors(async (req, res) => {
    const { page, limit } = req.query
    const { categoryId } = req.params

    const products = await productService.getProductsByCategory(categoryId, { page, limit })

    return sendResponse(
        res,
        httpStatus.OK,
        { products },
        'Products retrieved successfully'
    )
})

exports.getProductsBySearch = catchAsyncErrors(async (req, res) => {
    const products = await productService.getProductsBySearch(req.query)

    return sendResponse(
        res,
        httpStatus.OK,
        { products },
        'Product retrieved successfully'
    )
})

exports.getFullProductById = catchAsyncErrors(async (req, res) => {
    const { productId } = req.params

    const [product] = await productService.getFullProductById(productId)

    if (!product) {
        throw new ApiError(constant.MESSAGES.PRODUCT_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    return sendResponse(
        res,
        httpStatus.OK,
        { product },
        'Product retrieved successfully'
    )
})

exports.toggleLike = catchAsyncErrors(async (req, res) => {
    const { productId } = req.params

    const [product] = await productService.getFullProductById(productId)

    if (!product) {
        throw new ApiError(constant.MESSAGES.PRODUCT_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    const user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(constant.MESSAGES.USER_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    const like = toBoolean(req.query.like)

    if (!like || !await wishlistService.checkProductLikedWithUserId(productId, user._id)) {
        await wishlistService.likeUnlineProduct(productId, user._id, like)
    }

    return sendResponse(
        res,
        httpStatus.OK,
        { product },
        `Product ${like ? 'added to Wishlist' : 'removed from Wishlist'} successfully`
    )
})

exports.getWishlistProducts = catchAsyncErrors(async (req, res) => {
    const { page, limit } = req.query

    const user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(constant.MESSAGES.USER_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    const products = await wishlistService.getWishlistProducts(user._id, { page, limit })

    return sendResponse(
        res,
        httpStatus.OK,
        { products },
        'Wishlist Products retrieved successfully'
    )
})

exports.getWishlistProductsByCategory = catchAsyncErrors(async (req, res) => {
    const { page, limit } = req.query
    const { categoryId } = req.params

    const user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(constant.MESSAGES.USER_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    const products = await wishlistService.getWishlistProductsByCategory(user._id, categoryId, { page, limit })

    return sendResponse(
        res,
        httpStatus.OK,
        { products },
        'Wishlist Products retrieved successfully'
    )
})

exports.getWishlistProductsBySearch = catchAsyncErrors(async (req, res) => {
    const user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(constant.MESSAGES.USER_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    const products = await wishlistService.getWishlistProductsBySearch(user._id, req.query)

    return sendResponse(
        res,
        httpStatus.OK,
        { products },
        'Wishlist Products retrieved successfully'
    )
})

exports.toggleCart = catchAsyncErrors(async (req, res) => {
    const { productId } = req.params
    const { action, variant, quantity } = req.query

    const user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(constant.MESSAGES.USER_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    const [product] = await productService.getFullProductById(productId)

    if (!product) {
        throw new ApiError(constant.MESSAGES.PRODUCT_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    const variantId = variant || product.defaultVariant.id.toString()

    if (!await productService.getVariantById(variantId, productId)) {
        throw new ApiError(constant.MESSAGES.VARIANT_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    const cartProductVariant = await cartService.getCartProductVariant(productId, variantId, user._id)

    if (!cartProductVariant && (action === 'increase' || action === 'decrease')) {
        throw new ApiError(constant.MESSAGES.ADD_PRODUCT_TO_CART, httpStatus.CONFLICT)
    }
    else if (cartProductVariant && action === 'add') {
        await cartService.cartAction({ action: 'increase', productId, variantId, userId: user._id, quantity })
    }
    else if (cartProductVariant && action === 'decrease' && quantity >= cartProductVariant.items[0].quantity) {
        await cartService.cartAction({ action: 'remove', productId, variantId, userId: user._id, quantity })
    }
    else {
        await cartService.cartAction({ action, productId, variantId, userId: user._id, quantity })
    }

    return sendResponse(
        res,
        httpStatus.OK,
        { product },
        `${action === 'add' ? 'Product added to cart successfully'
            : action === 'remove' ? 'Product removed from cart successfully'
                : action === 'increase' ? 'Quantity increasesd successfully'
                    : 'Quantity decreased successfully'}`
    )
})

exports.getCartProducts = catchAsyncErrors(async (req, res) => {
    const { page, limit } = req.query

    const user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(constant.MESSAGES.USER_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    const items = await cartService.getCartProducts(user._id, { page, limit })

    const [{ amount }] = await cartService.getTotalAmount(user._id)

    return sendResponse(
        res,
        httpStatus.OK,
        { items, amount },
        'Cart Products retrieved successfully'
    )
})

exports.getCartProductsBySearch = catchAsyncErrors(async (req, res) => {
    const user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(constant.MESSAGES.USER_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    const products = await cartService.getCartProductsBySearch(user._id, req.query)

    return sendResponse(
        res,
        httpStatus.OK,
        { products },
        'Cart Products retrieved successfully'
    )
})

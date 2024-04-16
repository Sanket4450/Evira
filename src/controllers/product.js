const httpStatus = require('http-status')
const catchAsyncErrors = require('../utils/catchAsyncErrors')
const sendResponse = require('../utils/responseHandler')
const ApiError = require('../utils/ApiError')
const constant = require('../constants')
const {
    productService,
    userService,
    wishlistService,
    cartService,
    categoryService,
} = require('../services/index.service')

exports.getProducts = catchAsyncErrors(async (req, res) => {
    const { page, limit } = req.query

    const user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(
            constant.MESSAGES.USER_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    let products = await productService.getProducts({ page, limit })

    products = await productService.validateLikedProducts(user._id, products)

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

    if (!(await categoryService.getCategoryById(categoryId))) {
        throw new ApiError(
            constant.MESSAGES.CATEGORY_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    const user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(
            constant.MESSAGES.USER_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    let products = await productService.getProductsByCategory(categoryId, {
        page,
        limit,
    })

    products = await productService.validateLikedProducts(user._id, products)

    return sendResponse(
        res,
        httpStatus.OK,
        { products },
        'Products retrieved successfully'
    )
})

exports.getProductsBySearch = catchAsyncErrors(async (req, res) => {
    const user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(
            constant.MESSAGES.USER_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    let products = await productService.getProductsBySearch(req.query)

    products = await productService.validateLikedProducts(user._id, products)

    return sendResponse(
        res,
        httpStatus.OK,
        { products },
        'Product retrieved successfully'
    )
})

exports.getAdminProducts = catchAsyncErrors(async (req, res) => {
    if (!(await userService.getUserById(req.user.sub))) {
        throw new ApiError(
            constant.MESSAGES.ADMIN_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    const { countObject, products } = await productService.getAdminProducts(
        req.query
    )

    return sendResponse(
        res,
        httpStatus.OK,
        {
            products: {
                count: countObject?.count || 0,
                results: products,
            },
        },
        'Admin Products retrieved successfully'
    )
})


exports.getFullProductById = catchAsyncErrors(async (req, res) => {
    const { productId } = req.params

    const user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(
            constant.MESSAGES.USER_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    let [product] = await productService.getFullProductById(productId)

    if (!product) {
        throw new ApiError(
            constant.MESSAGES.PRODUCT_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    [product] = await productService.validateLikedProducts(user._id, [product])

    return sendResponse(
        res,
        httpStatus.OK,
        { product },
        'Product retrieved successfully'
    )
})

exports.getAdminFullProductById = catchAsyncErrors(async (req, res) => {
    const { productId } = req.params

    if (!await userService.getUserById(req.user.sub)) {
        throw new ApiError(
            constant.MESSAGES.ADMIN_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    let [product] = await productService.getAdminFullProductById(productId)

    if (!product) {
        throw new ApiError(
            constant.MESSAGES.PRODUCT_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
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
    const { isLiked } = req.body

    if (!(await productService.getProductById(productId))) {
        throw new ApiError(
            constant.MESSAGES.PRODUCT_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    const user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(
            constant.MESSAGES.USER_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    if (
        !isLiked ||
        !(await wishlistService.checkProductLikedWithUserId(
            productId,
            user._id
        ))
    ) {
        await wishlistService.likeUnlineProduct(productId, user._id, isLiked)
    }

    return sendResponse(
        res,
        httpStatus.OK,
        { isLiked },
        `Product ${
            isLiked ? 'added to Wishlist' : 'removed from Wishlist'
        } successfully`
    )
})

exports.getWishlistProducts = catchAsyncErrors(async (req, res) => {
    const { page, limit } = req.query

    const user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(
            constant.MESSAGES.USER_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    const products = await wishlistService.getWishlistProducts(user._id, {
        page,
        limit,
    })

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
        throw new ApiError(
            constant.MESSAGES.USER_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    if (!(await categoryService.getCategoryById(categoryId))) {
        throw new ApiError(
            constant.MESSAGES.CATEGORY_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    const products = await wishlistService.getWishlistProductsByCategory(
        user._id,
        categoryId,
        { page, limit }
    )

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
        throw new ApiError(
            constant.MESSAGES.USER_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    const products = await wishlistService.getWishlistProductsBySearch(
        user._id,
        req.query
    )

    return sendResponse(
        res,
        httpStatus.OK,
        { products },
        'Wishlist Products retrieved successfully'
    )
})

exports.toggleCart = catchAsyncErrors(async (req, res) => {
    const { productId, variantId, action, quantity } = req.body

    const user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(
            constant.MESSAGES.USER_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    const [product] = await productService.getFullProductById(productId)

    if (!product) {
        throw new ApiError(
            constant.MESSAGES.PRODUCT_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    const productVariant = await productService.getVariant(variantId, productId)

    if (!productVariant) {
        throw new ApiError(
            constant.MESSAGES.VARIANT_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    if ((action === 'add' || action === 'increase') && productVariant.quantity < quantity) {
        throw new ApiError(
            constant.MESSAGES.NOT_HAVE_ENOUGH_QUANTITY,
            httpStatus.CONFLICT
        )
    }

    const cartProductVariant = await cartService.getCartProductVariant(
        productId,
        variantId,
        user._id
    )

    const variant = cartProductVariant ? cartProductVariant.items.find((obj) => obj.variant.toString() === variantId) : null

    if (
        !cartProductVariant &&
        (action === 'increase' || action === 'decrease')
    ) {
        throw new ApiError(
            constant.MESSAGES.ADD_PRODUCT_TO_CART,
            httpStatus.CONFLICT
        )
    } else if (cartProductVariant && action === 'add') {
        await cartService.cartAction({
            action: 'increase',
            productId,
            variantId,
            userId: user._id,
            quantity,
        })
    } else if (
        cartProductVariant &&
        action === 'decrease' &&
        quantity >= variant?.quantity
    ) {
        await cartService.cartAction({
            action: 'remove',
            productId,
            variantId,
            userId: user._id,
            quantity,
        })
    } else {
        await cartService.cartAction({
            action,
            productId,
            variantId,
            userId: user._id,
            quantity,
        })
    }

    if (action === 'add' || action === 'increase') {
        await productService.modifyVariantQuantity(
            productId,
            variantId,
            quantity - quantity * 2
        )
    } else if (action === 'remove' || action === 'decrease' && quantity >= variant?.quantity) {
        await productService.modifyVariantQuantity(
            productId,
            variantId,
            variant?.quantity
        )
    } else {
        await productService.modifyVariantQuantity(
            productId,
            variantId,
            quantity
        )
    }

    // const productVariantCartAmount =
    //     await cartService.getProductVariantAmount(productId, variantId, user._id)
    const totalCartAmount = await cartService.getTotalAmount(user._id)

    // const productVariantAmount = productVariantCartAmount[0] ? productVariantCartAmount[0].amount : 0
    const totalAmount = totalCartAmount[0] ? totalCartAmount[0].amount : 0

    return sendResponse(
        res,
        httpStatus.OK,
        { action, totalAmount },
        `${
            action === 'add'
                ? 'Product added to cart successfully'
                : action === 'remove'
                ? 'Product removed from cart successfully'
                : action === 'increase'
                ? 'Quantity increasesd successfully'
                : 'Quantity decreased successfully'
        }`
    )
})

exports.getCartProducts = catchAsyncErrors(async (req, res) => {
    const user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(
            constant.MESSAGES.USER_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    const items = await cartService.getCartProducts(user._id)

    const totalAmount = await cartService.getTotalAmount(user._id)

    const amount = totalAmount[0] ? totalAmount[0].amount : 0

    return sendResponse(
        res,
        httpStatus.OK,
        { items, amount },
        'Cart Products retrieved successfully'
    )
})

exports.getVariants = catchAsyncErrors(async (req, res) => {
    const { productId } = req.params

    if (!(await userService.getUserById(req.user.sub))) {
        throw new ApiError(
            constant.MESSAGES.ADMIN_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    if (!(await productService.getProductById(productId))) {
        throw new ApiError(
            constant.MESSAGES.PRODUCT_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    const variants = await productService.getVariants(productId)

    return sendResponse(
        res,
        httpStatus.OK,
        { variants },
        'Variant posted successfully'
    )
})

exports.postVariant = catchAsyncErrors(async (req, res) => {
    const { productId } = req.params
    const body = req.body

    if (!(await userService.getUserById(req.user.sub))) {
        throw new ApiError(
            constant.MESSAGES.ADMIN_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    if (!(await productService.getProductById(productId))) {
        throw new ApiError(
            constant.MESSAGES.PRODUCT_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    const variant = await productService.createVariant(productId, body)

    return sendResponse(
        res,
        httpStatus.OK,
        { variant },
        'Variant posted successfully'
    )
})

exports.updateVariant = catchAsyncErrors(async (req, res) => {
    const { variantId } = req.params
    const body = req.body

    if (!(await userService.getUserById(req.user.sub))) {
        throw new ApiError(
            constant.MESSAGES.ADMIN_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    if (!(await productService.getVariantById(variantId))) {
        throw new ApiError(
            constant.MESSAGES.VARIANT_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    await productService.updateVariant(variantId, body)

    const variant = await productService.getVariantById(variantId)

    return sendResponse(
        res,
        httpStatus.OK,
        { variant },
        'Variant updated successfully'
    )
})

exports.deleteVariant = catchAsyncErrors(async (req, res) => {
    const { variantId } = req.params

    if (!(await userService.getUserById(req.user.sub))) {
        throw new ApiError(
            constant.MESSAGES.ADMIN_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    const variant = await productService.getVariantById(variantId)

    if (!variant) {
        throw new ApiError(
            constant.MESSAGES.VARIANT_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    await productService.deleteVariant(variantId)

    return sendResponse(
        res,
        httpStatus.OK,
        { variant },
        'Variant deleted successfully'
    )
})

exports.postProduct = catchAsyncErrors(async (req, res) => {
    const body = req.body

    const user = await userService.getUserById(req.user.sub)

    if (!user) {
        throw new ApiError(
            constant.MESSAGES.ADMIN_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    if (!(await categoryService.getCategoryById(body.category))) {
        throw new ApiError(
            constant.MESSAGES.CATEGORY_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    if (body.name && (await productService.getProductByName(body.name))) {
        throw new ApiError(
            constant.MESSAGES.PRODUCT_NAME_TAKEN,
            httpStatus.NOT_FOUND
        )
    }

    if (body.defaultVariant) {
        const variantBody = Object.assign({}, body.defaultVariant)
        delete body.defaultVariant

        const product = await productService.createProduct(user._id, body)
        const defaultVariant = await productService.createVariant(
            product._id,
            variantBody
        )

        return sendResponse(
            res,
            httpStatus.OK,
            { product, defaultVariant },
            'Product posted successfully'
        )
    }

    const product = await productService.createProduct(user._id, body)

    return sendResponse(
        res,
        httpStatus.OK,
        { product },
        'Product posted successfully'
    )
})

exports.updateProduct = catchAsyncErrors(async (req, res) => {
    const { productId } = req.params
    const body = req.body

    if (!(await userService.getUserById(req.user.sub))) {
        throw new ApiError(
            constant.MESSAGES.ADMIN_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    if (!(await productService.getProductById(productId))) {
        throw new ApiError(
            constant.MESSAGES.PRODUCT_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    await productService.updateProduct(productId, body)

    const [product] = await productService.getFullProductById(productId)

    return sendResponse(
        res,
        httpStatus.OK,
        { product },
        'Product updated successfully'
    )
})

exports.deleteProduct = catchAsyncErrors(async (req, res) => {
    const { productId } = req.params

    if (!(await userService.getUserById(req.user.sub))) {
        throw new ApiError(
            constant.MESSAGES.ADMIN_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    const [product] = await productService.getFullProductById(productId)

    if (!product) {
        throw new ApiError(
            constant.MESSAGES.PRODUCT_NOT_FOUND,
            httpStatus.NOT_FOUND
        )
    }

    await productService.deleteProduct(productId)

    await productService.deleteProductVariants(productId)

    return sendResponse(
        res,
        httpStatus.OK,
        { product },
        'Product deleted successfully'
    )
})

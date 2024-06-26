const httpStatus = require('http-status')
const constant = require('../constants')
const ApiError = require('../utils/ApiError')
const cartService = require('./cart')
const userService = require('./user')
const shippingService = require('./shipping')
const promotionService = require('./promotion')

exports.postCheckout = async ({ userId, address, shipping, promo }) => {
    try {
        Logger.info(
            `Inside postCheckout => address = ${address}, shippingType = ${shipping}, promoCode = ${promo}`
        )

        if (!(await userService.getAddressById(address, userId))) {
            throw new ApiError(
                constant.MESSAGES.ADDRESS_NOT_FOUND,
                httpStatus.NOT_FOUND
            )
        }

        const shippingType = await shippingService.getShippingTypeById(shipping)

        if (!shippingType) {
            throw new ApiError(
                constant.MESSAGES.SHIPPING_NOT_FOUND,
                httpStatus.NOT_FOUND
            )
        }

        let items = await cartService.getCheckoutProducts(userId)

        if (items.length === 0) {
            throw new ApiError(
                constant.MESSAGES.ADD_PRODUCTS,
                httpStatus.CONFLICT
            )
        }

        let [{ amount }] = await cartService.getTotalAmount(userId)

        if (promo) {
            if (!await promotionService.getPromoCodeById(promo)) {
                throw new ApiError(
                    constant.MESSAGES.PROMO_NOT_FOUND,
                    httpStatus.NOT_FOUND
                )
            }

            const promoCode = await promotionService.checkPromoCodeValidity(
                promo,
                Date.now()
            )

            if (!promoCode) {
                throw new ApiError(
                    constant.MESSAGES.PROMO_NOT_AVAILABLE,
                    httpStatus.CONFLICT
                )
            }

            await promotionService.updatePromoCode(promo, { remainingUses: promoCode.remainingUses - 1 })

            for (let item of items) {
                item.amount -=
                    (item.amount * promoCode.discountPercentage) / 100
            }

            amount -= (amount * promoCode.discountPercentage) / 100
            const finalAmount = amount + shippingType.charge

            return { items, finalAmount, discountPercentage: promoCode.discountPercentage }
        }

        const finalAmount = amount + shippingType.charge

        return { items, finalAmount, discountPercentage: 0 }
    } catch (error) {
        Logger.error(`postCheckout error => ${error}`)

        throw new ApiError(error.message, httpStatus.CONFLICT, error.stack)
    }
}

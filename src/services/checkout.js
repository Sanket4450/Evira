const mongoose = require('mongoose')
const httpStatus = require('http-status')
const dbRepo = require('../dbRepo')
const constant = require('../constants')
const ApiError = require('../utils/ApiError')
const cartService = require('./cart')
const userService = require('./user')

const getShippingTypeById = (id) => {
    const query = {
        _id: new mongoose.Types.ObjectId(id)
    }
    return dbRepo.findOne(constant.COLLECTIONS.SHIPPINGTYPE, { query })
}

const getShippingTypes = () => {
    return dbRepo.find(constant.COLLECTIONS.SHIPPINGTYPE, {})
}

const getPromoCodes = (date) => {
    date = (typeof date !== 'number') ? date.getTime() : date

    const query = {
        validFrom: { $lte: date },
        validUntil: { $gte: date }
    }

    const data = {
        code: 1,
        description: 1
    }

    return dbRepo.find(constant.COLLECTIONS.PROMOTION, { query, data })
}

const checkPromoCodeValidity = (id, date) => {
    date = (typeof date !== 'number') ? date.getTime() : date

    const query = {
        _id: new mongoose.Types.ObjectId(id),
        remainingUses: { $gte: 1 },
        validFrom: { $lte: date },
        validUntil: { $gte: date }
    }

    const data = {
        discountPercentage: 1
    }

    return dbRepo.findOne(constant.COLLECTIONS.PROMOTION, { query, data })
}

const postCheckout = async ({ userId, address, shipping, promo }) => {
    try {
        Logger.info(`Inside postCheckout => address = ${address} shipping-type = ${shipping} promo-code = ${promo}`)

        if (!await userService.getAddressById(address, userId)) {
            throw new ApiError(constant.MESSAGES.ADDRESS_NOT_FOUND, httpStatus.NOT_FOUND)
        }

        const { charge } = await getShippingTypeById(shipping)

        if (!charge) {
            throw new ApiError(constant.MESSAGES.SHIPPING_NOT_FOUND, httpStatus.NOT_FOUND)
        }

        let items = await cartService.getCheckoutProducts(userId)

        let [{ amount }] = await cartService.getTotalAmount(userId)

        if (!amount) {
            throw new ApiError(constant.MESSAGES.ADD_PRODUCTS, httpStatus.FORBIDDEN)
        }

        if (promo) {
            if (!new RegExp('^[0-9a-fA-F]{24}$').test(promo)) {
                throw new ApiError(constant.MESSAGES.ENTER_VALID_OBJECTID, httpStatus.BAD_REQUEST)
            }
            const { discountPercentage } = await checkPromoCodeValidity(promo, Date.now())

            if (!discountPercentage) {
                throw new ApiError(constant.MESSAGES.PROMO_NOT_FOUND, httpStatus.NOT_FOUND)
            }

            for (let item of items) {
                item.amount -= (item.amount * discountPercentage / 100)
            }

            amount -= (amount * discountPercentage / 100)
            const finalAmount = amount + charge

            return { items, finalAmount }
        }

        const finalAmount = amount + charge

        return { items, finalAmount }
    } catch (error) {
        Logger.error(error)

        throw new ApiError(error.message, httpStatus.CONFLICT, error.stack)
    }
}

module.exports = {
    getShippingTypes,
    getPromoCodes,
    getShippingTypeById,
    checkPromoCodeValidity,
    postCheckout
}

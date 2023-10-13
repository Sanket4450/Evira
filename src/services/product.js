const dbRepo = require('../dbRepo')
const constant = require('../constants')

exports.getAllProducts = () => {
    const query = {
        // query for products with most products sold or got most number of reviews
    }
    const data = {
        name: 1,
        image: 1,
        price: 1,
        sold: 1
    }
    return dbRepo.find(constant.COLLECTIONS.PRODUCT, { query, data })
}

exports.getCategories = () => {
    const query = {
        // query for categories with most products sold
    }
    const data = {
        name: 1,
        icon: 1
    }
    return dbRepo.find(constant.COLLECTIONS.CATEGORY, { query, data })
}

exports.getOffers = () => {
    const query = {
        // query for sorting the offers according to their importance
    }
    const data = {
        image: 1
    }
    return dbRepo.find(constant.COLLECTIONS.OFFER, { query, data })
}
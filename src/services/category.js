const mongoose = require('mongoose')
const dbRepo = require('../dbRepo')
const constant = require('../constants')
const productService = require('./product')

exports.getCategoryById = (id) => {
    const query = {
        _id: new mongoose.Types.ObjectId(id),
    }

    const data = {
        _id: 1,
    }

    return dbRepo.findOne(constant.COLLECTIONS.CATEGORY, { query, data })
}

exports.getFullCategoryById = (id) => {
    const query = {
        _id: new mongoose.Types.ObjectId(id),
    }
    return dbRepo.findOne(constant.COLLECTIONS.CATEGORY, { query })
}

exports.getFullCategoryByName = (name) => {
    const query = {
        name: { $regex: name, $options: 'i' },
    }
    return dbRepo.findOne(constant.COLLECTIONS.CATEGORY, { query })
}

exports.getCategories = ({ page, limit }) => {
    Logger.info(`Inside getCategories => page = ${page} & limit = ${limit}`)

    page ||= 1
    limit ||= 8

    const pipeline = [
        {
            $lookup: {
                from: 'products',
                localField: '_id',
                foreignField: 'category',
                as: 'categoryProducts',
            },
        },
        {
            $match: {
                categoryProducts: { $exists: true, $not: { $size: 0 } }
            }
        },
        {
            $skip: (page - 1) * limit,
        },
        {
            $limit: limit,
        },
        {
            $project: {
                name: 1,
                icon: 1,
                _id: 0,
                id: '$_id',
            }
        }
    ]

    return dbRepo.aggregate(constant.COLLECTIONS.CATEGORY, pipeline)
}

exports.getAllCategories = () => {
    Logger.info('Inside getAllCategories')

    const pipeline = [
        {
            $lookup: {
                from: 'products',
                localField: '_id',
                foreignField: 'category',
                as: 'categoryProducts',
            },
        },
        {
            $match: {
                categoryProducts: { $exists: true, $not: { $size: 0 } }
            }
        },
        {
            $project: {
                name: 1,
                icon: 1,
                description: 1,
                _id: 0,
                id: '$_id',
            }
        }
    ]

    return dbRepo.aggregate(constant.COLLECTIONS.CATEGORY, pipeline)
}

exports.getAdminCategories = ({ page, limit }) => {
    Logger.info(`Inside getAdminCategories => page = ${page}, limit = ${limit}`)

    page ||= 1
    limit ||= 8

    return dbRepo.findWithCount(constant.COLLECTIONS.CATEGORY, {}, {}, page, limit)
}

exports.postCategory = (categoryBody) => {
    Logger.info('Inside postCategory')

    const data = {
        ...categoryBody,
    }
    return dbRepo.create(constant.COLLECTIONS.CATEGORY, { data })
}

exports.updateCategory = (categoryId, categoryBody) => {
    Logger.info(`Inside updateCategory => category = ${categoryId}`)

    const query = {
        _id: new mongoose.Types.ObjectId(categoryId),
    }

    const data = {
        ...categoryBody,
    }

    return dbRepo.updateOne(constant.COLLECTIONS.CATEGORY, { query, data })
}

exports.deleteCategory = (categoryId) => {
    Logger.info(`Inside deleteCategory => category = ${categoryId}`)

    const query = {
        _id: new mongoose.Types.ObjectId(categoryId),
    }
    return dbRepo.deleteOne(constant.COLLECTIONS.CATEGORY, { query })
}

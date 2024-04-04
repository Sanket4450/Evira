const mongoose = require('mongoose')
const dbRepo = require('../dbRepo')
const constant = require('../constants')

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

    const query = {
        // query for categories
    }
    const data = {
        name: 1,
        icon: 1,
    }
    return dbRepo.findPage(
        constant.COLLECTIONS.CATEGORY,
        { query, data },
        {},
        page,
        limit
    )
}

exports.getAllCategories = () => {
    Logger.info('Inside getAllCategories')

    const query = {
        // query for categories
    }
    const data = {
        name: 1,
        icon: 1,
    }
    return dbRepo.find(constant.COLLECTIONS.CATEGORY, { query, data })
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

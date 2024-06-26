class DbRepo {
    constructor() {}

    findOne(collectionName, queryObject) {
        return new Promise((resolve, reject) => {
            domain[collectionName]
                .findOne(queryObject.query, queryObject.data)
                .then((results) => {
                    resolve(results)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

    create(collectionName, queryObject) {
        return new Promise((resolve, reject) => {
            domain[collectionName]
                .create(queryObject.data)
                .then((results) => {
                    resolve(results)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

    updateOne(collectionName, queryObject) {
        return new Promise((resolve, reject) => {
            domain[collectionName]
                .updateOne(
                    queryObject.query,
                    queryObject.data,
                    queryObject.options
                )
                .then((results) => {
                    resolve(results)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

    deleteOne(collectionName, queryObject) {
        return new Promise((resolve, reject) => {
            domain[collectionName]
                .deleteOne(queryObject.query)
                .then((results) => {
                    resolve(results)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

    deleteMany(collectionName, queryObject) {
        return new Promise((resolve, reject) => {
            domain[collectionName]
                .deleteMany(queryObject.query)
                .then((results) => {
                    resolve(results)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

    find(collectionName, queryObject, sortQuery = {}) {
        return new Promise((resolve, reject) => {
            domain[collectionName]
                .find(queryObject.query, queryObject.data)
                .sort(sortQuery)
                .then((results) => {
                    resolve(results)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

    findPage(collectionName, queryObject, sortQuery = {}, page, limit) {
        return new Promise((resolve, reject) => {
            domain[collectionName]
                .find(queryObject.query, queryObject.data)
                .sort(sortQuery)
                .skip((page - 1) * limit)
                .limit(limit)
                .then((results) => {
                    resolve(results)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

    findWithCount(collectionName, queryObject, sortQuery = {}, page, limit) {
        return new Promise(async (resolve, reject) => {
            try {
                const count = await domain[collectionName].countDocuments(
                    queryObject.query
                )
                const results = await domain[collectionName]
                    .find(queryObject.query, queryObject.data)
                    .sort(sortQuery)
                    .skip((page - 1) * limit)
                    .limit(limit)
                resolve({ count, results })
            } catch (error) {
                reject(error)
            }
        })
    }

    count(collectionName, queryObject) {
        return new Promise((resolve, reject) => {
            domain[collectionName]
                .countDocuments(queryObject.query)
                .then((results) => {
                    resolve(results)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

    aggregate(collectionName, queryArray) {
        return new Promise((resolve, reject) => {
            domain[collectionName]
                .aggregate(queryArray)
                .then((results) => {
                    resolve(results)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }
}

module.exports = new DbRepo()

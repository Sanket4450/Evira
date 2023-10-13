class DbRepo {
    constructor() { }

    findOne(collectionName, queryObject) {
        return new Promise((resolve, reject) => {
            domain[collectionName]
                .findOne(queryObject.query)
                .then(results => {
                    resolve(results)
                })
                .catch(error => {
                    reject(error)
                })
        })
    }

    create(collectionName, queryObject) {
        return new Promise((resolve, reject) => {
            domain[collectionName]
                .create(queryObject.data)
                .then(results => {
                    resolve(results)
                })
                .catch(error => {
                    reject(error)
                })
        })
    }

    updateOne(collectionName, queryObject) {
        return new Promise((resolve, reject) => {
            domain[collectionName]
                .updateOne(queryObject.query, queryObject.data)
                .then(results => {
                    resolve(results)
                })
                .catch(error => {
                    reject(error)
                })
        })
    }

    deleteOne(collectionName, queryObject) {
        return new Promise((resolve, reject) => {
            domain[collectionName]
                .deleteOne(queryObject.query)
                .then(results => {
                    resolve(results)
                })
                .catch(error => {
                    reject(error)
                })
        })
    }

    find(collectionName, queryObject) {
        return new Promise((resolve, reject) => {
            domain[collectionName]
                .find(queryObject.query, queryObject.data)
                .then(results => {
                    resolve(results)
                })
                .catch(error => {
                    reject(error)
                })
        })
    }

    aggregatePaginate(collectionName, queryObject, page, limit) {
        return new Promise((resolve, reject) => {
            domain[collectionName]
                .find(queryObject.query)
                .skip((page - 1) * limit)
                .limit(limit)
                .then(results => {
                    resolve(results)
                })
                .catch(error => {
                    reject(error)
                })
        })
    }
}

module.exports = new DbRepo()
const mongoose = require('mongoose')
const dbRepo = require('../dbRepo')
const constant = require('../constants')

exports.getOrderById = (orderId, userId) => {
    Logger.info(`Inside getOrderById => order = ${orderId}`)

    const query = {
        _id: new mongoose.Types.ObjectId(orderId),
        user: new mongoose.Types.ObjectId(userId),
    }

    const data = {
        user: 0,
        'status._id': 0,
    }

    return dbRepo.findOne(constant.COLLECTIONS.ORDER, { query, data })
}

exports.createOrder = (userId, orderBody) => {
    Logger.info('Inside createOrder')

    const data = {
        user: new mongoose.Types.ObjectId(userId),
        ...orderBody,
    }

    return dbRepo.create(constant.COLLECTIONS.ORDER, { data })
}

exports.checkUserCompletedOrder = (productId, userId) => {
    const query = {
        user: new mongoose.Types.ObjectId(userId),
        'item.product': new mongoose.Types.ObjectId(productId),
        type: { $regex: 'completed', $options: 'i' }
    }

    const data = {
        _id: 1
    }

    return dbRepo.findOne(constant.COLLECTIONS.ORDER, { query, data })
}

exports.updateOrder = (orderId, updateBody) => {
    Logger.info(`Inside updateOrder => order = ${orderId}`)

    const query = {
        _id: new mongoose.Types.ObjectId(orderId),
    }

    const data = {
        $set: {
            ...updateBody,
        },
    }

    return dbRepo.updateOne(constant.COLLECTIONS.ORDER, { query, data })
}

exports.getOrderStatus = (orderId) => {
    Logger.info(`Inside getOrderStatus => order = ${orderId}`)

    const query = {
        _id: new mongoose.Types.ObjectId(orderId),
    }

    const data = {
        status: 1,
    }

    return dbRepo.findOne(constant.COLLECTIONS.ORDER, { query, data })
}

exports.updateOrderStatus = (orderId, pushBody) => {
    Logger.info(`Inside updateOrderStatus => order = ${orderId}`)

    const query = {
        _id: new mongoose.Types.ObjectId(orderId),
    }

    const data = {
        $push: {
            status: {
                $each: [pushBody],
                $position: 0,
            },
        },
    }

    return dbRepo.updateOne(constant.COLLECTIONS.ORDER, { query, data })
}

exports.removeLatestOrderStatus = (orderId) => {
    Logger.info(`Inside removeLatestOrderStatus => order = ${orderId}`)

    const query = {
        _id: new mongoose.Types.ObjectId(orderId),
    }

    const data = {
        $pop: {
            status: -1
        },
    }

    return dbRepo.updateOne(constant.COLLECTIONS.ORDER, { query, data })
}

exports.getOrders = (type, userId, { page, limit }) => {
    Logger.info(
        `Inside getOrders => type = ${type}, page = ${page}, limit = ${limit}`
    )

    page ||= 1
    limit ||= 10

    const pipeline = [
        {
            $match: {
                user: new mongoose.Types.ObjectId(userId),
                type: { $regex: type, $options: 'i' },
            },
        },
        {
            $lookup: {
                from: 'products',
                localField: 'item.product',
                foreignField: '_id',
                as: 'product',
            },
        },
        {
            $unwind: '$product',
        },
        {
            $lookup: {
                from: 'variants',
                localField: 'item.variant',
                foreignField: '_id',
                as: 'variant',
            },
        },
        {
            $unwind: '$variant',
        },
        {
            $group: {
                _id: '$_id',
                product: { $first: '$item.product' },
                variant: { $first: '$item.variant' },
                name: { $first: '$product.name' },
                image: { $first: '$product.image' },
                color: { $first: '$variant.color' },
                size: { $first: '$variant.size' },
                quantity: { $first: '$item.quantity' },
                amount: { $first: '$amount' },
                createdAt: { $first: '$createdAt' },
            },
        },
        {
            $sort: {
                createdAt: -1
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
                product: 1,
                variant: 1,
                name: 1,
                image: 1,
                color: 1,
                size: 1,
                quantity: 1,
                amount: 1,
                _id: 0,
                id: '$_id',
            },
        },
    ]

    return dbRepo.aggregate(constant.COLLECTIONS.ORDER, pipeline)
}

exports.getTrackOrder = (orderId, userId) => {
    Logger.info(`Inside getTrackOrder => order = ${orderId}`)

    const query = {
        _id: new mongoose.Types.ObjectId(orderId),
        user: new mongoose.Types.ObjectId(userId),
    }

    const data = {
        status: 1,
        _id: 0,
    }

    return dbRepo.findOne(constant.COLLECTIONS.ORDER, { query, data })
}

exports.getAdminOrderById = (id) => {
    Logger.info(`Inside getAdminOrderById => order = ${id}`)

    const pipeline = [
        {
            $match: {
                _id: new mongoose.Types.ObjectId(id)
            }
        },
        {
            $limit: 1
        },
        {
            $lookup: {
                from: 'products',
                localField: 'item.product',
                foreignField: '_id',
                as: 'product',
            },
        },
        {
            $unwind: {
                path: '$product',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'shippingtypes',
                localField: 'shippingType',
                foreignField: '_id',
                as: 'shippingType',
            },
        },
        {
            $unwind: {
                path: '$shippingType',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'user',
            },
        },
        {
            $unwind: {
                path: '$user',
                preserveNullAndEmptyArrays: true // Preserve unmatched documents
            }
        },
        {
            $lookup: {
                from: 'variants',
                localField: 'item.variant',
                foreignField: '_id',
                as: 'variant',
            },
        },
        {
            $unwind: {
                path: '$variant',
                preserveNullAndEmptyArrays: true // Preserve unmatched documents
            }
        },
        {
            $group: {
                _id: '$_id',
                type: { $first: '$type' },
                status: { $first: '$status' },
                billingName: { $first: '$user.fullName' },
                product: { $first: '$product' },
                variant: { $first: '$variant' },
                quantity: { $first: '$item.quantity' },
                discountPercentage: { $first: '$discountPercentage' },
                shippingCharge: { $first: '$shippingType.charge' },
                amount: { $first: '$amount' },
            },
        },
        {
            $project: {
                type: 1,
                status: 1,
                billingName: 1,
                product: {
                    image: 1,
                    name: 1,
                },
                variant: {
                    color: 1,
                    size: 1,
                    price: 1,
                },
                quantity: 1,
                discountPercentage: 1,
                shippingCharge: 1,
                amount: 1,
                _id: 0,
                id: '$_id',
            },
        },
    ];

    return dbRepo.aggregate(constant.COLLECTIONS.ORDER, pipeline)
}


exports.getAdminOrderInfoById = (id) => {
    Logger.info(`Inside getAdminOrderById => order = ${id}`)

    const query = {
        _id: new mongoose.Types.ObjectId(id),
    }

    return dbRepo.findOne(constant.COLLECTIONS.ORDER, { query })
}

exports.getAdminOrders = async (status, { page, limit }) => {
    Logger.info(
        `Inside getAdminOrders => status = ${status}, page = ${page}, limit = ${limit}`
    )

    page ||= 1
    limit ||= 10

    const pipeline = [
        {
            $lookup: {
                from: 'products',
                localField: 'item.product',
                foreignField: '_id',
                as: 'product',
            },
        },
        {
            $unwind: '$product',
        },
        {
            $lookup: {
                from: 'users',
                localField: 'orders.user',
                foreignField: 'id',
                as: 'users_info',
            },
        },
        {
            $unwind: '$users_info',
        },
        {
            $lookup: {
                from: 'variants',
                localField: 'item.variant',
                foreignField: '_id',
                as: 'variant',
            },
        },
        {
            $unwind: '$variant',
        },
        {
            $group: {
                _id: '$_id',
                product: { $first: '$item.product' },
                variant: { $first: '$item.variant' },
                name: { $first: '$product.name' },
                image: { $first: '$product.image' },
                color: { $first: '$variant.color' },
                size: { $first: '$variant.size' },
                quantity: { $first: '$item.quantity' },
                amount: { $first: '$amount' },
                users_info: { $first: '$users_info' },
                status: { $first: { $arrayElemAt: ['$status.title', 0] } },
                type: { $first: '$type' },
                createdAt: { $first: '$createdAt' },
            },
        },
        {
            $sort: {
                createdAt: -1,
            },
        },
        {
            $skip: (page - 1) * limit,
        },
        {
            $limit: limit,
        },
        {
            $project: {
                product: 1,
                variant: 1,
                name: 1,
                image: 1,
                color: 1,
                size: 1,
                quantity: 1,
                amount: 1,
                _id: 0,
                id: '$_id',
                users_info: '$users_info',
                createdAt: 1,
                status: 1,
                type: 1
            },
        },
    ]

    const countPipeline = [
        {
            $lookup: {
                from: 'products',
                localField: 'item.product',
                foreignField: '_id',
                as: 'product',
            },
        },
        {
            $unwind: '$product',
        },
        {
            $lookup: {
                from: 'variants',
                localField: 'item.variant',
                foreignField: '_id',
                as: 'variant',
            },
        },
        {
            $unwind: '$variant',
        },
        {
            $group: {
                _id: '$_id',
                product: { $first: '$item.product' },
                variant: { $first: '$item.variant' },
                name: { $first: '$product.name' },
                image: { $first: '$product.image' },
                color: { $first: '$variant.color' },
                size: { $first: '$variant.size' },
                quantity: { $first: '$item.quantity' },
                amount: { $first: '$amount' },
                status: { $first: { $arrayElemAt: ['$status.title', 0] } },
            },
        },
        {
            $count: "totalRecords"
        }
    ]

    if (status) {
        pipeline.splice(7, 0, {
            $match: {
                status: { $regex: status === 'all' ? '' : status, $options: 'i' },
            },
        })

        countPipeline.splice(5, 0, {
            $match: {
                status: { $regex: status === 'all' ? '' : status, $options: 'i' },
            },
        })
    }

    const count = await dbRepo.aggregate(constant.COLLECTIONS.ORDER, countPipeline)
    const orders = await dbRepo.aggregate(constant.COLLECTIONS.ORDER, pipeline)

    return ({ results: orders, count: count?.[0]?.totalRecords })
}

exports.getAdminDashboardRevenue = async (type) => {
    Logger.info(
        `Inside getAdminOrders => type = ${type}`
    )

    const pipeline = [
        {
            $group: {
                _id: '$_id',
                amount: { $first: '$amount' },
            },
        },
        {
            $project: {
                amount: 1,
                _id: 0,
                id: '$_id',
            },
        },
    ]

    const countPipeline = [
        {
            $lookup: {
                from: 'products',
                localField: 'item.product',
                foreignField: '_id',
                as: 'product',
            },
        },
        {
            $unwind: '$product',
        },
        {
            $lookup: {
                from: 'variants',
                localField: 'item.variant',
                foreignField: '_id',
                as: 'variant',
            },
        },
        {
            $unwind: '$variant',
        },
        {
            $group: {
                _id: '$_id',
                product: { $first: '$item.product' },
                variant: { $first: '$item.variant' },
                name: { $first: '$product.name' },
                image: { $first: '$product.image' },
                color: { $first: '$variant.color' },
                size: { $first: '$variant.size' },
                quantity: { $first: '$item.quantity' },
                amount: { $first: '$amount' },
            },
        }, {
            $count: "totalRecords" // Count the total number of records
        }
    ]

    const currentMonthPipeline = [
        {
            $match: {
                createdAt: {
                    $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                    $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
                }
            }
        },
        {
            $group: {
                _id: '$_id',
                amount: { $first: '$amount' },
            },
        },
        {
            $project: {
                amount: 1,
                _id: 0,
                id: '$_id',
            },
        },
    ]

    const today = new Date();
    const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 1);

    const lastMonthPipeline = [
        {
            $match: {
                createdAt: {
                    $gte: lastMonthStart,
                    $lt: lastMonthEnd
                }
            }
        },
        {
            $group: {
                _id: '$_id',
                amount: { $first: '$amount' },
            },
        },
        {
            $project: {
                amount: 1,
                _id: 0,
                id: '$_id',
            },
        },
    ]


    const currentDate = new Date();
    // For week
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Start of the current week (Sunday)

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // For Year 
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1); // Start of the current year

    const monthsOfYear = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // For Month
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); // Start of the current month
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0); // End of the current month
    

    const dayOfWeekPipeline = [
        // Match orders based on type
        {
            $match: {
                type: { $in: ["completed", "ongoing"] } // Adjust types as needed
            }
        },
        // Match orders based on date range (current week)
        {
            $match: {
                createdAt: {
                    $gte: startOfWeek, // Start of current week (Sunday)
                    $lte: currentDate // Current date
                }
            }
        },
        // Group by type and day of the week
        {
            $group: {
                _id: {
                    type: "$type",
                    dayOfWeek: { $dayOfWeek: "$createdAt" } // Get the day of the week (1-7, starting from Sunday)
                },
                count: { $sum: 1 }
            }
        },
        // Project to rename fields and prepare data for formatting
        {
            $project: {
                _id: 0,
                name: "$_id.type",
                dayOfWeek: { $arrayElemAt: [daysOfWeek, { $subtract: ["$_id.dayOfWeek", 1] }] },
                count: 1
            }
        },
        // Group by type to create arrays for each day of the week
        {
            $group: {
                _id: "$name",
                data: {
                    $push: {
                        k: "$dayOfWeek",
                        v: "$count"
                    }
                }
            }
        },
        // Convert array of key-value pairs to object
        {
            $project: {
                _id: 0,
                name: "$_id",
                data: { $arrayToObject: "$data" }
            }
        },
        // Project to add missing days with count 0
        {
            $project: {
                name: 1,
                data: {
                    $mergeObjects: [
                        { Sunday: { $ifNull: ["$data.Sunday", 0] } },
                        { Monday: { $ifNull: ["$data.Monday", 0] } },
                        { Tuesday: { $ifNull: ["$data.Tuesday", 0] } },
                        { Wednesday: { $ifNull: ["$data.Wednesday", 0] } },
                        { Thursday: { $ifNull: ["$data.Thursday", 0] } },
                        { Friday: { $ifNull: ["$data.Friday", 0] } },
                        { Saturday: { $ifNull: ["$data.Saturday", 0] } }
                    ]
                }
            }
        }
    ];

    const yearPipeline = [
        // Match orders based on type
        {
            $match: {
                type: { $in: ["completed", "ongoing"] } // Adjust types as needed
            }
        },
        // Match orders based on date range (current year)
        {
            $match: {
                createdAt: {
                    $gte: startOfYear, // Start of current year
                    $lte: currentDate // Current date
                }
            }
        },
        // Group by type and month
        {
            $group: {
                _id: {
                    type: "$type",
                    month: { $month: "$createdAt" } // Get the month (1-12)
                },
                count: { $sum: 1 }
            }
        },
        // Project to rename fields and prepare data for formatting
        {
            $project: {
                _id: 0,
                name: "$_id.type",
                month: { $arrayElemAt: [monthsOfYear, { $subtract: ["$_id.month", 1] }] },
                count: 1
            }
        },
        // Group by type to create arrays for each month
        {
            $group: {
                _id: "$name",
                data: {
                    $push: {
                        k: "$month",
                        v: "$count"
                    }
                }
            }
        },
        // Convert array of key-value pairs to object
        {
            $project: {
                _id: 0,
                name: "$_id",
                data: { $arrayToObject: "$data" }
            }
        },
        // Project to add missing months with count 0
        {
            $project: {
                name: 1,
                data: {
                    $mergeObjects: [
                        { January: { $ifNull: ["$data.January", 0] } },
                        { February: { $ifNull: ["$data.February", 0] } },
                        { March: { $ifNull: ["$data.March", 0] } },
                        { April: { $ifNull: ["$data.April", 0] } },
                        { May: { $ifNull: ["$data.May", 0] } },
                        { June: { $ifNull: ["$data.June", 0] } },
                        { July: { $ifNull: ["$data.July", 0] } },
                        { August: { $ifNull: ["$data.August", 0] } },
                        { September: { $ifNull: ["$data.September", 0] } },
                        { October: { $ifNull: ["$data.October", 0] } },
                        { November: { $ifNull: ["$data.November", 0] } },
                        { December: { $ifNull: ["$data.December", 0] } }
                    ]
                }
            }
        }
    ];

    const MonthPipeline =  [
        // Match orders based on type and date range (current month)
        {
            $match: {
                type: { $in: ["completed", "ongoing"] }, // Adjust types as needed
                createdAt: {
                    $gte: startOfMonth, // Start of the current month
                    $lte: endOfMonth // End of the current month
                }
            }
        },
        // Group by type and day of the month
        {
            $group: {
                _id: {
                    type: "$type",
                    dayOfMonth: { $dayOfMonth: "$createdAt" } // Get the day of the month
                },
                count: { $sum: 1 }
            }
        },
        // Project to rename fields and prepare data for formatting
        {
            $project: {
                _id: 0,
                name: "$_id.type",
                dayOfMonth: { $toString: "$_id.dayOfMonth" }, // Convert day of the month to string
                count: 1
            }
        },
        // Group by type to create arrays for each day of the month
        {
            $group: {
                _id: "$name",
                data: {
                    $push: {
                        k: "$dayOfMonth",
                        v: "$count"
                    }
                }
            }
        },
        // Convert array of key-value pairs to object
        {
            $project: {
                _id: 0,
                name: "$_id",
                data: { $arrayToObject: "$data" }
            }
        },
        // Project to add missing days with count 0
        {
            $project: {
                name: 1,
                data: {
                    $mergeObjects: Array.from({ length: endOfMonth.getDate() }, (_, i) => ({
                        [(i + 1).toString()]: { $ifNull: ["$data." + (i + 1).toString(), 0] }
                    }))
                }
            }
        }
    ];
    if (type) {
        pipeline.unshift({
            $match: {
                type: { $regex: type, $options: 'i' },
            },
        })


        countPipeline.unshift({
            $match: {
                type: { $regex: type, $options: 'i' },
            },
        })
        currentMonthPipeline.unshift({
            $match: {
                type: { $regex: type, $options: 'i' },
            },
        })
        lastMonthPipeline.unshift({
            $match: {
                type: { $regex: type, $options: 'i' },
            },
        })
    }

    const count = await dbRepo.aggregate(constant.COLLECTIONS.ORDER, countPipeline)
    const orders = await dbRepo.aggregate(constant.COLLECTIONS.ORDER, pipeline)
    const currentMonth = await dbRepo.aggregate(constant.COLLECTIONS.ORDER, currentMonthPipeline)
    const lastMonth = await dbRepo.aggregate(constant.COLLECTIONS.ORDER, lastMonthPipeline)

    const ordersByDayOfWeek = await dbRepo.aggregate(constant.COLLECTIONS.ORDER, dayOfWeekPipeline);
    const ordersByYear = await dbRepo.aggregate(constant.COLLECTIONS.ORDER, yearPipeline);
    const ordersByMonth = await dbRepo.aggregate(constant.COLLECTIONS.ORDER, MonthPipeline);
   
    function getTotalAmount(data) {
        let total = 0;
        data.forEach(item => {
            total += item.amount;
        });
        return total;
    }

    return ({
        chartData: { week: ordersByDayOfWeek, year: ordersByYear, month: ordersByMonth }, Revenue: getTotalAmount(orders), Orders: count?.[0]?.totalRecords, currentMonth: { Revenue: getTotalAmount(currentMonth), Orders: currentMonth?.length }, lastMonth: { Revenue: getTotalAmount(lastMonth), Orders: lastMonth?.length }
    })
}
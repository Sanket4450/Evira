const mongoose = require('mongoose')
const fieldsRemoval = require('./plugins/fieldsRemoval')

const shippingSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
    },
    addressId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        required: true,
    },
    estimatedDelivery: {
        type: Date
    },
    status: {
        type: String,
        enum: ['Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
        default: 'Shipped'
    }
},
    {
        timestamps: true
    })

shippingSchema.plugin(fieldsRemoval)

module.exports = mongoose.model('Shipping', shippingSchema)
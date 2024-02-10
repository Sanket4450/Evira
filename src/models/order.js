const mongoose = require('mongoose')
const fieldsRemoval = require('./plugins/fieldsRemoval')

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        item: {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            variant: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
        address: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Address',
            required: true,
        },
        shippingType: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ShippingType',
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        paymentMethod: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PaymentMethod',
            default: null,
        },
        type: {
            type: String,
            enum: ['Ongoing', 'Completed'],
            default: 'Ongoing',
        },
        status: [
            {
                title: {
                    type: String,
                    enum: [
                        'Ordered',
                        'Shipped',
                        'Out for Delivery',
                        'Delivered',
                        'Canceled',
                    ],
                    default: 'Ordered',
                },
                description: {
                    type: String,
                },
                date: {
                    type: Date,
                    default: Date.now(),
                },
            },
        ],
    },
    {
        timestamps: true,
        autoIndex: false,
    }
)

orderSchema.plugin(fieldsRemoval)

module.exports = mongoose.model('Order', orderSchema)

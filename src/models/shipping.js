import mongoose, { Mongoose } from 'mongoose'
import fieldsRemoval from './plugins/fieldsRemoval.js'

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

export default mongoose.model('Shipping', shippingSchema)
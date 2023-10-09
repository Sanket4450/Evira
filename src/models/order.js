import mongoose from 'mongoose'
import fieldsRemoval from './plugins/fieldsRemoval.js'

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        required: true
    },
    status: {
        type: String,
        enum: ['Ongoing', 'Completed'],
        default: 'Ongoing'
    },
    orderDate: {
        type: Date,
        default: Date.now()
    }
},
    {
        autoIndex: false
    })

orderSchema.plugin(fieldsRemoval)

export default mongoose.model('Order', orderSchema)
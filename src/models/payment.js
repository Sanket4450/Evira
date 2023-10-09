import mongoose from 'mongoose'
import fieldsRemoval from './plugins/fieldsRemoval.js'

const paymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    amount: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending'
    }
},
{
    timestamps: true,
    autoIndex: false
})

paymentSchema.plugin(fieldsRemoval)

export default mongoose.model('Payment', paymentSchema)
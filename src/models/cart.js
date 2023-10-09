import mongoose from 'mongoose'
import fieldsRemoval from './plugins/fieldsRemoval.js'

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: {
            type: String,
            default: 1
        }
    }]
},
    {
        autoIndex: false
    })

cartSchema.plugin(fieldsRemoval)

export default mongoose.model('Cart', cartSchema)
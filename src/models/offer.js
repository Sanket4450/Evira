import mongoose from 'mongoose'
import fieldsRemoval from './plugins/fieldsRemoval.js'

const offerSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    discountPercentage: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    }
},
    {
        timestamps: true
    })

offerSchema.plugin(fieldsRemoval)

export default mongoose.model('Offer', offerSchema)
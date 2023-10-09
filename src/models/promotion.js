import mongoose from 'mongoose'
import fieldsRemoval from './plugins/fieldsRemoval.js'

const promotionSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String
    },
    discountPercentage: {
        type: Number,
        required: true
    },
    maxUses: {
        type: Number,
        default: null
    },
    validFrom: {
        type: Date
    },
    validUntil: {
        type: Date
    }
},
    {
        timestamps: true
    })

promotionSchema.plugin(fieldsRemoval)

export default mongoose.model('Promotion', promotionSchema)
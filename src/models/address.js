import mongoose from 'mongoose'
import fieldsRemoval from './plugins/fieldsRemoval.js'

const addressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['home', 'office', 'other'],
        required: true
    },
    street: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    landmark: {
        type: String
    },
    state: {
        type: String
    },
    postalCode: {
        type: String,
        required: true
    }
},
    {
        autoIndex: false
    })

addressSchema.plugin(fieldsRemoval)

export default mongoose.model('Address', addressSchema)
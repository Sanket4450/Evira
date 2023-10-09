import mongoose from 'mongoose'
import fieldsRemoval from './plugins/fieldsRemoval.js'

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    }
},
    {
        autoIndex: false
    })

categorySchema.plugin(fieldsRemoval)

export default mongoose.model('Category', categorySchema)
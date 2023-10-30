const mongoose = require('mongoose')
const fieldsRemoval = require('./plugins/fieldsRemoval')

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        default: 'myIcon.svg'
    },
    description: {
        type: String
    }
},
    {
        autoIndex: false
    })

categorySchema.plugin(fieldsRemoval)

module.exports = mongoose.model('Category', categorySchema)

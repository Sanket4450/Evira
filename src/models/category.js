const mongoose = require('mongoose')
const fieldsRemoval = require('./plugins/fieldsRemoval')

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

module.exports = mongoose.model('Category', categorySchema)
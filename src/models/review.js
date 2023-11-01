const mongoose = require('mongoose')
const fieldsRemoval = require('./plugins/fieldsRemoval')

const reviewSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String
    },
    star: {
        type: Number,
        enum: [1, 2, 3, 4, 5],
        required: true
    },
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
},
    {
        timestamps: true,
        autoIndex: false
    })

reviewSchema.plugin(fieldsRemoval)

module.exports = mongoose.model('Review', reviewSchema)

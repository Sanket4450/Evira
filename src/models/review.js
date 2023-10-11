const mongoose = require('mongoose')
const fieldsRemoval = require('./plugins/fieldsRemoval')

const reviewSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String
    },
    stars: {
        type: Number,
        enum: [1, 2, 3, 4, 5]
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
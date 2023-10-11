const mongoose = require('mongoose')
const fieldsRemoval = require('./plugins/fieldsRemoval')

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
    },
    nickName: {
        type: String
    },
    profileImage: {
        type: String,
        default: null
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        trim: true
    },
    mobile: {
        type: Number,
        unique: true
    },
    dateOfBirth: {
        type: Date
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other']
    },
    language: {
        type: String
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isNotificationEnabled: {
        type: Boolean,
        default: true
    },
    token: {
        type: String,
        default: null
    }
},
    {
        timestamps: true,
        autoIndex: false
    })

userSchema.plugin(fieldsRemoval)

module.exports = mongoose.model('User', userSchema)
const mongoose = require('mongoose')
const fieldsRemoval = require('./plugins/fieldsRemoval')

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
        },
        nickName: {
            type: String,
        },
        profileImage: {
            type: String,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            unique: true,
        },
        password: {
            type: String,
            trim: true,
        },
        mobile: {
            type: Number,
            unique: true,
        },
        dateOfBirth: {
            type: Date,
        },
        gender: {
            type: String,
            enum: ['male', 'female', 'other'],
        },
        language: {
            type: String,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        isNotificationEnabled: {
            type: Boolean,
            default: true,
        },
        isProfileCompleted: {
            type: Boolean,
            default: false,
        },
        token: {
            type: String,
            default: null,
        },
        resetOTP: {
            type: Number,
        },
    },
    {
        timestamps: true,
        autoIndex: false,
    }
)

userSchema.plugin(fieldsRemoval)

module.exports = mongoose.model('User', userSchema)

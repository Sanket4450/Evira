const nodemailer = require('nodemailer')
const ejs = require('ejs')
const fs = require('fs')
const ApiError = require('./ApiError')
const constant = require('../constants')

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 587,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
})

const sendMail = async ({ email, subject, templateFile, data }) => {
    ejs.renderFile(templateFile, data, (err, htmlContent) => {
        if (err) {
            throw new ApiError(constant.MESSAGES.EMAIL_RENDER_ERROR, 500)
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject,
            html: htmlContent,
        }

        transporter.sendMail(mailOptions, (err, _) => {
            if (err) {
                throw new ApiError(constant.MESSAGES.EMAIL_SEND_ERROR, 500)
            }
        })
    })
}

module.exports = sendMail

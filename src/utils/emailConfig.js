const nodemailer = require('nodemailer')
const httpStatus = require('http-status')
const ejs = require('ejs')
const fs = require('fs')
const util = require('util')
const ApiError = require('./ApiError')

const readFileAsync = util.promisify(fs.readFile)

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
})

const sendMail = async ({ email, subject, templateFile, data }) => {
    try {
        const htmlContent = await readFileAsync(templateFile, 'utf-8')

        const renderedHtml = ejs.render(htmlContent, data)

        const mailOptions = {
            from: `${process.env.EMAIL_HOST} <${process.env.EMAIL_USER}>`,
            to: email,
            subject,
            html: renderedHtml,
        }

        await transporter.sendMail(mailOptions)
    } catch (error) {
        throw new ApiError(error.message, httpStatus.INTERNAL_SERVER_ERROR)
    }
}

module.exports = sendMail

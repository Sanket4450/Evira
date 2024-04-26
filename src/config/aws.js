const AWS = require('aws-sdk')
const configConstant = require('./constants')

AWS.config.update({ region: configConstant.REGION })

// Set AWS credentials
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

module.exports = { AWS }

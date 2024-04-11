require('dotenv').config({ path: '.env.local' })
const fs = require('fs')

const AWS = require('aws-sdk')

AWS.config.update({ region: process.env.REGION })

// Set AWS credentials
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

const s3 = new AWS.S3()

const img = '/Users/sankettalaviya/Desktop/Projects/Evira/img1.png'

const params = {
  Bucket: process.env.BUCKET_NAME,
  Key: 'users/sanket.png',
  Body: fs.createReadStream(img),
}

s3.upload(params, (err, data) => {
  if (err) {
    console.log('error uploading file', err)
  } else {
    const urlParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: 'users/sanket.png',
      Expires: 3600, // URL expiration time in seconds (e.g., 1 hour)
    }

    s3.getSignedUrl('getObject', urlParams, (err, url) => {
      if (err) {
        console.log('Error generating presigned URL:', err)
      } else {
        console.log('Presigned URL:', url)
      }
    })
  }
})

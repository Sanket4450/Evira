const { AWS } = require('../config/aws')
const httpStatus = require('http-status')
const ApiError = require('../utils/ApiError')
const constant = require('../constants')

const s3 = new AWS.S3()

const uploadFile = async (folderName, fileName, file) => {
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: `${folderName}/${fileName}`,
    Body: file,
  }

  s3.upload(params, (err, data) => {
    if (err) {
      throw new ApiError(
        constant.MESSAGES.SOMETHING_WENT_WRONG,
        httpStatus.INTERNAL_SERVER_ERROR
      )
    } else {
      const urlParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: `${folderName}/${fileName}`,
      }

      s3.getSignedUrl('getObject', urlParams, (err, url) => {
        if (err) {
          throw new ApiError(
            constant.MESSAGES.SOMETHING_WENT_WRONG,
            httpStatus.INTERNAL_SERVER_ERROR
          )
        } else {
          console.log('Presigned URL:', url)
        }
      })
    }
  })
}

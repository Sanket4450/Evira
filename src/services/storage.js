const { AWS } = require('../config/aws')
const httpStatus = require('http-status')
const ApiError = require('../utils/ApiError')
const constant = require('../constants')
const configConstant = require('../config/constants')

const s3 = new AWS.S3()

exports.uploadFile = async (folderName, fileName, file) => {
  const params = {
    Bucket: configConstant.BUCKET_NAME,
    Key: `${folderName}/${fileName}`,
    Body: file,
  }

  return new Promise((resolve, reject) => [
    s3.upload(params, (err, data) => {
      if (err) {
        reject(
          new ApiError(
            constant.MESSAGES.SOMETHING_WENT_WRONG,
            httpStatus.INTERNAL_SERVER_ERROR
          )
        )
      }
      resolve(data.Location)
    }),
  ])
}

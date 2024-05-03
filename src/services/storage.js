const { PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3')
const httpStatus = require('http-status')
const { s3Client } = require('../config/aws')
const ApiError = require('../utils/ApiError')
const constant = require('../constants')
const configConstant = require('../config/constants')

exports.uploadFile = async (folderName, fileName, file) => {
  try {
    const bucketName = configConstant.BUCKET_NAME
    const region = configConstant.REGION
    const objectKey = `${folderName}/${fileName}`

    const params = {
      Bucket: bucketName,
      Key: objectKey,
      Body: file,
    }

    await s3Client.send(new PutObjectCommand(params))

    const objectUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${objectKey}`

    return objectUrl
  } catch (error) {
    throw new ApiError(
      constant.MESSAGES.SOMETHING_WENT_WRONG,
      httpStatus.INTERNAL_SERVER_ERROR
    )
  }
}

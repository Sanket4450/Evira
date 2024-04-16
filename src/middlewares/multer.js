const multer = require('multer')
const fs = require('fs')
const os = require('os')
const httpStatus = require('http-status')
const osTempDir = fs.realpathSync(os.tmpdir())
const ApiError = require('../utils/ApiError')

exports.uploadFile = async (req, res, next) => {
  try {
    const storage = multer.diskStorage({
      destination: (_req, _file, cb) => {
        cb(null, osTempDir)
      },
    })

    const maxFileSize = parseInt(process.env.MAX_FILE_SIZE)
    const fileFieldName = process.env.FILE_FIELD_NAME

    const upload = multer({
      storage,
      limits: { fileSize: maxFileSize, files: 1 },
    }).single(fileFieldName)

    upload(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          switch (err.code) {
          case 'LIMIT_FILE_SIZE':
            next(new ApiError(`Upload file size is limited to ${(maxFileSize / 1024 / 1024).toPrecision(2)} MB`, httpStatus.BAD_REQUEST))
            break;
          case 'LIMIT_FILE_COUNT':
            next(new ApiError(`Upload is limited to 1 file`, httpStatus.BAD_REQUEST))
            break;
          case 'LIMIT_UNEXPECTED_FILE':
            next(new ApiError('Upload encountered an unexpected file', httpStatus.BAD_REQUEST))
            break;
          case 'LIMIT_PART_COUNT':
            next(new ApiError('Upload rejected: upload form has too many parts', httpStatus.BAD_REQUEST))
            break;
          case 'LIMIT_FIELD_KEY':
            next(new ApiError('Upload rejected: upload field name for the files is too long', httpStatus.BAD_REQUEST))
            break;
          case 'LIMIT_FIELD_VALUE':
            next(new ApiError('Upload rejected: upload field is too long', httpStatus.BAD_REQUEST))
            break;
          case 'LIMIT_FIELD_COUNT':
            next(new ApiError('Upload rejected: too many fields', httpStatus.BAD_REQUEST))
            break;
          default:
            next(new ApiError(`Upload failed with the following error: ${err.message}`, httpStatus.BAD_REQUEST))
          }
        }
        next(err)
      }
      next()
    })
  } catch (error) {
    Logger.error(error)
    next(error)
  }
}

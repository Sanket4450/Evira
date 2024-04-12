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

        const upload = multer({ storage, limits: { files: 1 } }).single('file')

        upload(req, res, (err) => {
            if (err) {
                if (err instanceof multer.MulterError) {
                    throw new ApiError(err.code, httpStatus.BAD_REQUEST)
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

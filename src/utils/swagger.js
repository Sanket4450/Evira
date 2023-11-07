const router = require('express').Router()
const fs = require('fs')
const path = require('path')
const yaml = require('yaml')
const swaggerUi = require('swagger-ui-express')

const yamlFile = fs.readFileSync(path.join(process.cwd(), 'api_docs/Evira.yaml'), 'utf8')
const swaggerDocument = yaml.parse(yamlFile)

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument, { customCssUrl: 'https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui.css' }))

module.exports = router

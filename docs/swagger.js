const swaggerUi = require('swagger-ui-express')
const { buildOpenApiSpec } = require('./openapi')

const setupSwagger = (app) => {
  const spec = buildOpenApiSpec()

  app.get('/api-docs.json', (_req, res) => {
    res.json(spec)
  })

  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(spec, {
      customSiteTitle: 'Marketplace API Docs',
      customCss: '.swagger-ui .topbar { display: none }',
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        tryItOutEnabled: true,
        withCredentials: true,
      },
    })
  )
}

module.exports = { setupSwagger }

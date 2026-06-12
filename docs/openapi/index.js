require('dotenv').config()
const { components } = require('./components')
const authPaths = require('./paths/auth')
const dashboardPaths = require('./paths/dashboard')
const homePaths = require('./paths/home')
const ordersPaths = require('./paths/orders')
const chatPaths = require('./paths/chat')
const paymentPaths = require('./paths/payment')

const port = process.env.PORT || 5000

const buildOpenApiSpec = () => ({
    openapi: '3.0.3',
    info: {
        title: 'E-commerce Marketplace API',
        version: '1.0.0',
        description: [
            'REST API documentation for the multi-vendor e-commerce backend.',
            '',
            '**Authentication:** Admin and seller routes use the `accessToken` cookie. Customer routes use `customerToken`.',
            '',
            '**Swagger UI:** Interactive docs at `/api-docs`. Raw OpenAPI JSON at `/api-docs.json`.',
            '',
            '**Note:** Real-time chat also uses Socket.IO events (not covered in this REST spec).'
        ].join('\n')
    },
    servers: [
        {
            url: `http://localhost:${port}/api`,
            description: 'Local development'
        }
    ],
    tags: [
        { name: 'Auth', description: 'Admin and seller authentication' },
        { name: 'Customer Auth', description: 'Customer authentication' },
        { name: 'Categories', description: 'Category management' },
        { name: 'Products', description: 'Product management' },
        { name: 'Sellers', description: 'Seller management (admin)' },
        { name: 'Storefront', description: 'Public storefront endpoints' },
        { name: 'Cart & Wishlist', description: 'Shopping cart and wishlist' },
        { name: 'Orders', description: 'Order management' },
        { name: 'Chat', description: 'REST chat endpoints' },
        { name: 'Payments', description: 'Stripe Connect payments' }
    ],
    components,
    paths: {
        ...authPaths,
        ...dashboardPaths,
        ...homePaths,
        ...ordersPaths,
        ...chatPaths,
        ...paymentPaths
    }
})

module.exports = { buildOpenApiSpec }

const components = {
  securitySchemes: {
    accessTokenCookie: {
      type: 'apiKey',
      in: 'cookie',
      name: 'accessToken',
      description: 'JWT cookie set on admin/seller login (7-day expiry)',
    },
    customerTokenCookie: {
      type: 'apiKey',
      in: 'cookie',
      name: 'customerToken',
      description: 'JWT cookie set on customer login/register',
    },
  },
  schemas: {
    Error: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
    Message: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
    TokenResponse: {
      type: 'object',
      properties: {
        token: { type: 'string' },
        message: { type: 'string' },
      },
    },
    LoginRequest: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string', format: 'password' },
      },
    },
    RegisterRequest: {
      type: 'object',
      required: ['email', 'password', 'name'],
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string', format: 'password' },
        name: { type: 'string' },
      },
    },
    UserInfo: {
      type: 'object',
      properties: {
        userInfo: { type: 'object' },
      },
    },
    Category: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        name: { type: 'string' },
        slug: { type: 'string' },
        image: { type: 'string' },
      },
    },
    Product: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        sellerId: { type: 'string' },
        name: { type: 'string' },
        slug: { type: 'string' },
        shopName: { type: 'string' },
        category: { type: 'string' },
        brand: { type: 'string' },
        description: { type: 'string' },
        stock: { type: 'integer' },
        price: { type: 'integer' },
        discount: { type: 'integer' },
        images: { type: 'array', items: { type: 'string' } },
        rating: { type: 'number' },
      },
    },
    ChatMessage: {
      type: 'object',
      properties: {
        senderId: { type: 'string' },
        receverId: { type: 'string' },
        message: { type: 'string' },
        productId: { type: 'string' },
      },
    },
  },
  responses: {
    Unauthorized: {
      description: 'Missing or invalid accessToken cookie',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/Error' },
          example: { error: 'Please Login First' },
        },
      },
    },
    NotFound: {
      description: 'Resource not found',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/Error' },
        },
      },
    },
    ServerError: {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/Error' },
        },
      },
    },
  },
}

module.exports = { components }

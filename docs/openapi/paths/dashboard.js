module.exports = {
  '/category-add': {
    post: {
      tags: ['Categories'],
      summary: 'Add a category (with image upload)',
      security: [{ accessTokenCookie: [] }],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              required: ['name', 'image'],
              properties: {
                name: { type: 'string' },
                image: { type: 'string', format: 'binary' },
              },
            },
          },
        },
      },
      responses: {
        201: { description: 'Category created' },
        404: { description: 'Upload failed' },
        409: { $ref: '#/components/responses/Unauthorized' },
        500: { $ref: '#/components/responses/ServerError' },
      },
    },
  },
  '/category-get': {
    get: {
      tags: ['Categories'],
      summary: 'List categories (paginated/search)',
      security: [{ accessTokenCookie: [] }],
      parameters: [
        { name: 'page', in: 'query', schema: { type: 'integer' } },
        { name: 'parPage', in: 'query', schema: { type: 'integer' } },
        { name: 'searchValue', in: 'query', schema: { type: 'string' } },
      ],
      responses: {
        200: {
          description: 'Category list',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  categorys: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Category' },
                  },
                  totalCategory: { type: 'integer' },
                },
              },
            },
          },
        },
        409: { $ref: '#/components/responses/Unauthorized' },
      },
    },
  },
  '/product-add': {
    post: {
      tags: ['Products'],
      summary: 'Add a product (multipart with images)',
      security: [{ accessTokenCookie: [] }],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                category: { type: 'string' },
                description: { type: 'string' },
                stock: { type: 'string' },
                discount: { type: 'string' },
                price: { type: 'string' },
                shopName: { type: 'string' },
                brand: { type: 'string' },
                images: {
                  type: 'array',
                  items: { type: 'string', format: 'binary' },
                },
              },
            },
          },
        },
      },
      responses: {
        201: { description: 'Product created' },
        409: { $ref: '#/components/responses/Unauthorized' },
        500: { $ref: '#/components/responses/ServerError' },
      },
    },
  },
  '/products-get': {
    get: {
      tags: ['Products'],
      summary: 'Get seller products',
      security: [{ accessTokenCookie: [] }],
      parameters: [
        { name: 'page', in: 'query', schema: { type: 'integer' } },
        { name: 'parPage', in: 'query', schema: { type: 'integer' } },
        { name: 'searchValue', in: 'query', schema: { type: 'string' } },
      ],
      responses: {
        200: { description: 'Product list' },
        409: { $ref: '#/components/responses/Unauthorized' },
      },
    },
  },
  '/product-get/{productId}': {
    get: {
      tags: ['Products'],
      summary: 'Get single product by ID',
      security: [{ accessTokenCookie: [] }],
      parameters: [
        {
          name: 'productId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: { description: 'Product details' },
        409: { $ref: '#/components/responses/Unauthorized' },
      },
    },
  },
  '/product-update': {
    post: {
      tags: ['Products'],
      summary: 'Update product fields',
      security: [{ accessTokenCookie: [] }],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                productId: { type: 'string' },
                name: { type: 'string' },
                description: { type: 'string' },
                stock: { type: 'integer' },
                price: { type: 'integer' },
                discount: { type: 'integer' },
              },
            },
          },
        },
      },
      responses: {
        200: { description: 'Product updated' },
        409: { $ref: '#/components/responses/Unauthorized' },
      },
    },
  },
  '/product-image-update': {
    post: {
      tags: ['Products'],
      summary: 'Update product images',
      security: [{ accessTokenCookie: [] }],
      requestBody: {
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: {
                productId: { type: 'string' },
                images: {
                  type: 'array',
                  items: { type: 'string', format: 'binary' },
                },
              },
            },
          },
        },
      },
      responses: {
        200: { description: 'Images updated' },
        409: { $ref: '#/components/responses/Unauthorized' },
      },
    },
  },
  '/request-seller-get': {
    get: {
      tags: ['Sellers'],
      summary: 'Get pending seller registration requests',
      security: [{ accessTokenCookie: [] }],
      parameters: [
        { name: 'page', in: 'query', schema: { type: 'integer' } },
        { name: 'parPage', in: 'query', schema: { type: 'integer' } },
        { name: 'searchValue', in: 'query', schema: { type: 'string' } },
      ],
      responses: {
        200: { description: 'Pending sellers' },
        409: { $ref: '#/components/responses/Unauthorized' },
      },
    },
  },
  '/get-seller/{sellerId}': {
    get: {
      tags: ['Sellers'],
      summary: 'Get seller by ID',
      security: [{ accessTokenCookie: [] }],
      parameters: [
        {
          name: 'sellerId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: { description: 'Seller details' },
        409: { $ref: '#/components/responses/Unauthorized' },
      },
    },
  },
  '/seller-status-update': {
    post: {
      tags: ['Sellers'],
      summary: 'Approve or deactivate a seller',
      security: [{ accessTokenCookie: [] }],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                sellerId: { type: 'string' },
                status: { type: 'string', enum: ['active', 'deactive'] },
              },
            },
          },
        },
      },
      responses: {
        200: { description: 'Status updated' },
        409: { $ref: '#/components/responses/Unauthorized' },
      },
    },
  },
  '/get-sellers': {
    get: {
      tags: ['Sellers'],
      summary: 'List active sellers',
      security: [{ accessTokenCookie: [] }],
      parameters: [
        { name: 'page', in: 'query', schema: { type: 'integer' } },
        { name: 'parPage', in: 'query', schema: { type: 'integer' } },
        { name: 'searchValue', in: 'query', schema: { type: 'string' } },
      ],
      responses: {
        200: { description: 'Active sellers' },
        409: { $ref: '#/components/responses/Unauthorized' },
      },
    },
  },
  '/get-deactive-sellers': {
    get: {
      tags: ['Sellers'],
      summary: 'List deactivated sellers',
      security: [{ accessTokenCookie: [] }],
      parameters: [
        { name: 'page', in: 'query', schema: { type: 'integer' } },
        { name: 'parPage', in: 'query', schema: { type: 'integer' } },
        { name: 'searchValue', in: 'query', schema: { type: 'string' } },
      ],
      responses: {
        200: { description: 'Deactivated sellers' },
        409: { $ref: '#/components/responses/Unauthorized' },
      },
    },
  },
}

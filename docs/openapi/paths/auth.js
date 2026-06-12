module.exports = {
  '/admin-login': {
    post: {
      tags: ['Auth'],
      summary: 'Admin login',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/LoginRequest' },
          },
        },
      },
      responses: {
        200: {
          description: 'Login successful; sets accessToken cookie',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TokenResponse' },
            },
          },
        },
        404: { $ref: '#/components/responses/NotFound' },
        500: { $ref: '#/components/responses/ServerError' },
      },
    },
  },
  '/seller-register': {
    post: {
      tags: ['Auth'],
      summary: 'Register a new seller',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/RegisterRequest' },
          },
        },
      },
      responses: {
        201: {
          description: 'Registration successful; sets accessToken cookie',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TokenResponse' },
            },
          },
        },
        404: { $ref: '#/components/responses/NotFound' },
        500: { $ref: '#/components/responses/ServerError' },
      },
    },
  },
  '/seller-login': {
    post: {
      tags: ['Auth'],
      summary: 'Seller login',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/LoginRequest' },
          },
        },
      },
      responses: {
        200: {
          description: 'Login successful; sets accessToken cookie',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TokenResponse' },
            },
          },
        },
        404: { $ref: '#/components/responses/NotFound' },
        500: { $ref: '#/components/responses/ServerError' },
      },
    },
  },
  '/get-user': {
    get: {
      tags: ['Auth'],
      summary: 'Get current admin or seller profile',
      security: [{ accessTokenCookie: [] }],
      responses: {
        200: {
          description: 'User info',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UserInfo' },
            },
          },
        },
        409: { $ref: '#/components/responses/Unauthorized' },
        500: { $ref: '#/components/responses/ServerError' },
      },
    },
  },
  '/profile-image-upload': {
    post: {
      tags: ['Auth'],
      summary: 'Upload seller profile image',
      security: [{ accessTokenCookie: [] }],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: {
                image: { type: 'string', format: 'binary' },
              },
            },
          },
        },
      },
      responses: {
        201: { description: 'Image uploaded' },
        409: { $ref: '#/components/responses/Unauthorized' },
      },
    },
  },
  '/profile-info-add': {
    post: {
      tags: ['Auth'],
      summary: 'Update seller shop profile info',
      security: [{ accessTokenCookie: [] }],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                shopName: { type: 'string' },
                division: { type: 'string' },
                district: { type: 'string' },
                sub_district: { type: 'string' },
              },
            },
          },
        },
      },
      responses: {
        201: { description: 'Profile updated' },
        409: { $ref: '#/components/responses/Unauthorized' },
      },
    },
  },
  '/logout': {
    get: {
      tags: ['Auth'],
      summary: 'Logout admin or seller',
      security: [{ accessTokenCookie: [] }],
      responses: {
        200: {
          description: 'Logged out; clears accessToken cookie',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Message' },
            },
          },
        },
        409: { $ref: '#/components/responses/Unauthorized' },
      },
    },
  },
  '/customer/customer-register': {
    post: {
      tags: ['Customer Auth'],
      summary: 'Register a new customer',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/RegisterRequest' },
          },
        },
      },
      responses: {
        200: {
          description: 'Registration successful; sets customerToken cookie',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TokenResponse' },
            },
          },
        },
        404: { $ref: '#/components/responses/NotFound' },
      },
    },
  },
  '/customer/customer-login': {
    post: {
      tags: ['Customer Auth'],
      summary: 'Customer login',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/LoginRequest' },
          },
        },
      },
      responses: {
        201: {
          description: 'Login successful; sets customerToken cookie',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TokenResponse' },
            },
          },
        },
        404: { $ref: '#/components/responses/NotFound' },
      },
    },
  },
  '/customer/logout': {
    get: {
      tags: ['Customer Auth'],
      summary: 'Customer logout',
      responses: {
        200: {
          description: 'Logged out; clears customerToken cookie',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Message' },
            },
          },
        },
      },
    },
  },
}

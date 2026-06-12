module.exports = {
  '/chat/customer/add-customer-friend': {
    post: {
      tags: ['Chat'],
      summary: 'Add a seller as chat friend (customer)',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                customerId: { type: 'string' },
                sellerId: { type: 'string' },
              },
            },
          },
        },
      },
      responses: {
        201: { description: 'Friend added' },
      },
    },
  },
  '/chat/customer/send-message-to-seller': {
    post: {
      tags: ['Chat'],
      summary: 'Send message from customer to seller',
      requestBody: {
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ChatMessage' },
          },
        },
      },
      responses: {
        201: { description: 'Message sent' },
      },
    },
  },
  '/chat/seller/get-customers/{sellerId}': {
    get: {
      tags: ['Chat'],
      summary: 'Get customers for a seller',
      parameters: [
        {
          name: 'sellerId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: { description: 'Customer list' },
      },
    },
  },
  '/chat/seller/get-customer-message/{customerId}': {
    get: {
      tags: ['Chat'],
      summary: 'Get message history with a customer',
      security: [{ accessTokenCookie: [] }],
      parameters: [
        {
          name: 'customerId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: { description: 'Messages' },
        409: { $ref: '#/components/responses/Unauthorized' },
      },
    },
  },
  '/chat/seller/send-message-to-customer': {
    post: {
      tags: ['Chat'],
      summary: 'Send message from seller to customer',
      security: [{ accessTokenCookie: [] }],
      requestBody: {
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ChatMessage' },
          },
        },
      },
      responses: {
        201: { description: 'Message sent' },
        409: { $ref: '#/components/responses/Unauthorized' },
      },
    },
  },
  '/chat/admin/get-sellers': {
    get: {
      tags: ['Chat'],
      summary: 'Get sellers for admin chat',
      security: [{ accessTokenCookie: [] }],
      responses: {
        200: { description: 'Seller list' },
        409: { $ref: '#/components/responses/Unauthorized' },
      },
    },
  },
  '/chat/message-send-seller-admin': {
    post: {
      tags: ['Chat'],
      summary: 'Send message between seller and admin',
      security: [{ accessTokenCookie: [] }],
      requestBody: {
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ChatMessage' },
          },
        },
      },
      responses: {
        201: { description: 'Message sent' },
        409: { $ref: '#/components/responses/Unauthorized' },
      },
    },
  },
  '/chat/get-admin-message/{receverId}': {
    get: {
      tags: ['Chat'],
      summary: 'Get admin messages for a receiver',
      security: [{ accessTokenCookie: [] }],
      parameters: [
        {
          name: 'receverId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: { description: 'Messages' },
        409: { $ref: '#/components/responses/Unauthorized' },
      },
    },
  },
  '/chat/get-seller-message': {
    get: {
      tags: ['Chat'],
      summary: 'Get seller admin messages',
      security: [{ accessTokenCookie: [] }],
      responses: {
        200: { description: 'Messages' },
        409: { $ref: '#/components/responses/Unauthorized' },
      },
    },
  },
}

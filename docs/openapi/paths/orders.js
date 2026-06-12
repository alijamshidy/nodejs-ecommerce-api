module.exports = {
  '/home/order/place-order': {
    post: {
      tags: ['Orders'],
      summary: 'Place a new order',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                price: { type: 'number' },
                products: { type: 'array', items: { type: 'object' } },
                shipping_fee: { type: 'number' },
                shippingInfo: { type: 'object' },
                userId: { type: 'string' },
              },
            },
          },
        },
      },
      responses: {
        201: { description: 'Order placed' },
      },
    },
  },
  '/home/customer/get-dashboard-data/{userId}': {
    get: {
      tags: ['Orders'],
      summary: 'Customer dashboard summary',
      parameters: [
        {
          name: 'userId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: { description: 'Dashboard data' },
      },
    },
  },
  '/home/customer/get-orders/{customerId}/{status}': {
    get: {
      tags: ['Orders'],
      summary: 'Get customer orders by status',
      parameters: [
        {
          name: 'customerId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
        },
        {
          name: 'status',
          in: 'path',
          required: true,
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: { description: 'Order list' },
      },
    },
  },
  '/home/customer/get-order-details/{orderId}': {
    get: {
      tags: ['Orders'],
      summary: 'Get customer order details',
      parameters: [
        {
          name: 'orderId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: { description: 'Order details' },
      },
    },
  },
  '/admin-orders': {
    get: {
      tags: ['Orders'],
      summary: 'Get all orders (admin)',
      parameters: [
        { name: 'page', in: 'query', schema: { type: 'integer' } },
        { name: 'parPage', in: 'query', schema: { type: 'integer' } },
        { name: 'searchValue', in: 'query', schema: { type: 'string' } },
      ],
      responses: {
        200: { description: 'Admin order list' },
      },
    },
  },
  '/admin/order/{orderId}': {
    get: {
      tags: ['Orders'],
      summary: 'Get order details (admin)',
      parameters: [
        {
          name: 'orderId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: { description: 'Order details' },
      },
    },
  },
  '/admin/order-status/update/{orderId}': {
    put: {
      tags: ['Orders'],
      summary: 'Update order status (admin)',
      parameters: [
        {
          name: 'orderId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
        },
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                status: { type: 'string' },
              },
            },
          },
        },
      },
      responses: {
        200: { description: 'Status updated' },
      },
    },
  },
  '/seller/orders/{sellerId}': {
    get: {
      tags: ['Orders'],
      summary: 'Get seller orders',
      parameters: [
        {
          name: 'sellerId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
        },
        { name: 'status', in: 'query', schema: { type: 'string' } },
      ],
      responses: {
        200: { description: 'Seller order list' },
      },
    },
  },
  '/seller/order/{orderId}': {
    get: {
      tags: ['Orders'],
      summary: 'Get order details (seller)',
      parameters: [
        {
          name: 'orderId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: { description: 'Order details' },
      },
    },
  },
  '/seller/order-status/update/{orderId}': {
    put: {
      tags: ['Orders'],
      summary: 'Update order status (seller)',
      parameters: [
        {
          name: 'orderId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
        },
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                status: { type: 'string' },
              },
            },
          },
        },
      },
      responses: {
        200: { description: 'Status updated' },
      },
    },
  },
}

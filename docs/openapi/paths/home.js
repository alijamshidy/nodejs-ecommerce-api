module.exports = {
  '/home/get-category': {
    get: {
      tags: ['Storefront'],
      summary: 'Get all public categories',
      responses: {
        200: {
          description: 'Categories',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  categories: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Category' },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  '/home/get-product': {
    get: {
      tags: ['Storefront'],
      summary: 'Get homepage product sections',
      responses: {
        200: { description: 'Products, latest, top rated, and discount sections' },
      },
    },
  },
  '/home/price-range-latest-product': {
    get: {
      tags: ['Storefront'],
      summary: 'Filter products by price range',
      parameters: [
        { name: 'lowPrice', in: 'query', schema: { type: 'integer' } },
        { name: 'highPrice', in: 'query', schema: { type: 'integer' } },
      ],
      responses: {
        200: { description: 'Filtered products' },
      },
    },
  },
  '/home/query-products': {
    get: {
      tags: ['Storefront'],
      summary: 'Search and filter products',
      parameters: [
        { name: 'category', in: 'query', schema: { type: 'string' } },
        { name: 'rating', in: 'query', schema: { type: 'number' } },
        { name: 'lowPrice', in: 'query', schema: { type: 'integer' } },
        { name: 'highPrice', in: 'query', schema: { type: 'integer' } },
        { name: 'sortPrice', in: 'query', schema: { type: 'string' } },
        { name: 'pageNumber', in: 'query', schema: { type: 'integer' } },
        { name: 'searchValue', in: 'query', schema: { type: 'string' } },
      ],
      responses: {
        200: { description: 'Matching products' },
      },
    },
  },
  '/home/product-details/{slug}': {
    get: {
      tags: ['Storefront'],
      summary: 'Get product details by slug',
      parameters: [
        {
          name: 'slug',
          in: 'path',
          required: true,
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: { description: 'Product details with related products' },
      },
    },
  },
  '/home/customer/submit-review': {
    post: {
      tags: ['Storefront'],
      summary: 'Submit a product review',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                productId: { type: 'string' },
                name: { type: 'string' },
                rating: { type: 'integer', minimum: 1, maximum: 5 },
                review: { type: 'string' },
              },
            },
          },
        },
      },
      responses: {
        201: { description: 'Review submitted' },
      },
    },
  },
  '/home/customer/get-review/{productId}': {
    get: {
      tags: ['Storefront'],
      summary: 'Get reviews for a product',
      parameters: [
        {
          name: 'productId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: { description: 'Product reviews' },
      },
    },
  },
  '/home/product/add-to-card': {
    post: {
      tags: ['Cart & Wishlist'],
      summary: 'Add product to cart',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                userId: { type: 'string' },
                productId: { type: 'string' },
                quantity: { type: 'integer' },
              },
            },
          },
        },
      },
      responses: {
        201: { description: 'Added to cart' },
        404: { description: 'Already in cart' },
      },
    },
  },
  '/home/product/get-card-products/{userId}': {
    get: {
      tags: ['Cart & Wishlist'],
      summary: 'Get cart items for a user',
      parameters: [
        {
          name: 'userId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: { description: 'Cart products' },
      },
    },
  },
  '/home/product/delete-card-product/{card_id}': {
    delete: {
      tags: ['Cart & Wishlist'],
      summary: 'Remove item from cart',
      parameters: [
        {
          name: 'card_id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: { description: 'Item removed' },
      },
    },
  },
  '/home/product/quantity-inc/{card_id}': {
    put: {
      tags: ['Cart & Wishlist'],
      summary: 'Increase cart item quantity',
      parameters: [
        {
          name: 'card_id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: { description: 'Quantity updated' },
      },
    },
  },
  '/home/product/quantity-dec/{card_id}': {
    put: {
      tags: ['Cart & Wishlist'],
      summary: 'Decrease cart item quantity',
      parameters: [
        {
          name: 'card_id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: { description: 'Quantity updated' },
      },
    },
  },
  '/home/product/add-to-wishlist': {
    post: {
      tags: ['Cart & Wishlist'],
      summary: 'Add product to wishlist',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                userId: { type: 'string' },
                productId: { type: 'string' },
                name: { type: 'string' },
                price: { type: 'integer' },
                image: { type: 'string' },
                discount: { type: 'integer' },
                rating: { type: 'number' },
                slug: { type: 'string' },
              },
            },
          },
        },
      },
      responses: {
        201: { description: 'Added to wishlist' },
        404: { description: 'Already in wishlist' },
      },
    },
  },
  '/home/product/get-wishlist-products/{userId}': {
    get: {
      tags: ['Cart & Wishlist'],
      summary: 'Get wishlist items',
      parameters: [
        {
          name: 'userId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: { description: 'Wishlist products' },
      },
    },
  },
  '/home/product/remove-wishlist-product/{wishlistId}': {
    delete: {
      tags: ['Cart & Wishlist'],
      summary: 'Remove item from wishlist',
      parameters: [
        {
          name: 'wishlistId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: { description: 'Item removed' },
      },
    },
  },
}

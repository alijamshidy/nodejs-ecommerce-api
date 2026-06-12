module.exports = {
  '/payment/create-stripe-connect-account': {
    get: {
      tags: ['Payments'],
      summary: 'Create or resume Stripe Connect onboarding',
      security: [{ accessTokenCookie: [] }],
      responses: {
        201: {
          description: 'Stripe onboarding URL',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  url: { type: 'string', format: 'uri' },
                },
              },
            },
          },
        },
        409: { $ref: '#/components/responses/Unauthorized' },
      },
    },
  },
}

# Node.js E-Commerce API

REST API and real-time Socket.IO server for a multi-vendor e-commerce marketplace. It powers authentication, sellers, customers, products, categories, collections, cart, wishlist, orders, payments, content management, chat, reports, and Swagger/OpenAPI documentation.

## Screenshot

Add screenshots to `docs/screenshots/` and update the links below:

```md
![Swagger API docs](docs/screenshots/swagger.png)
![API response example](docs/screenshots/api-response.png)
```

## Features

- Admin, seller, and customer authentication
- JWT/cookie-based protected routes
- OTP email login support
- Product, category, collection, seller, and report modules
- Customer cart, wishlist, reviews, and order flows
- Stripe payment integration
- Cloudinary media uploads
- Content management for header, slider, recommendations, FAQ, and contact sections
- Real-time chat between admin, sellers, and customers with Socket.IO
- MongoDB persistence with Mongoose models
- Seed scripts for initial data
- Swagger UI and OpenAPI JSON endpoint
- Docker and Docker Compose setup with MongoDB

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.IO
- JWT
- Stripe
- Cloudinary
- Nodemailer
- Swagger UI Express
- Docker

## Installation

Clone the repository:

```bash
git clone https://github.com/alijamshidy/nodejs-ecommerce-api.git
cd nodejs-ecommerce-api
```

Install dependencies:

```bash
npm install
```

Create `.env` from the example file:

```bash
cp .env.example .env
```

Start MongoDB locally, then run the API:

```bash
npm run dev
```

The server runs on the port defined in `PORT`, usually `http://localhost:5000`.

### Docker

```bash
docker compose up --build
```

Docker Compose starts MongoDB, runs the seed service, and starts the backend API.

## Environment Variables

```env
PORT=5000
DB_URL=mongodb://localhost:27017/myapp_db
SECRET=change_me_to_a_long_random_string

cloud_name=your_cloudinary_cloud_name
api_key=your_cloudinary_api_key
api_secret=your_cloudinary_api_secret

STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM="Your Shop <your-email@gmail.com>"
```

## Folder Structure

```text
.
├── controllers/
│   ├── chat/
│   ├── content/
│   ├── dashboard/
│   ├── home/
│   ├── order/
│   └── payment/
├── docs/
│   └── openapi/
├── init_data/
├── middlewares/
├── models/
│   ├── Chat/
│   └── content/
├── routes/
│   ├── content/
│   ├── dashboard/
│   ├── home/
│   └── order/
├── seed/
├── utils/
├── docker-compose.yml
├── Dockerfile
└── server.js
```

## Demo

No public backend demo URL is configured yet.

Local API:

```text
http://localhost:5000
```

## API Documentation

After starting the server, open:

```text
http://localhost:5000/api-docs
```

OpenAPI JSON:

```text
http://localhost:5000/api-docs.json
```

Main route groups:

| Area | Base path |
| --- | --- |
| Dashboard categories | `/api` |
| Dashboard products | `/api` |
| Dashboard reports | `/api` |
| Dashboard sellers | `/api` |
| Auth | `/api` |
| Customer auth | `/api` |
| Storefront home | `/api/home` |
| Content | `/api` and `/api/home` |
| Orders | `/api` |
| Chat | `/api` |
| Payments | `/api` |

Socket.IO events include:

- `add_user`
- `add_seller`
- `add_admin`
- `send_seller_message`
- `send_customer_message`
- `send_message_admin_to_seller`
- `send_message_seller_to_admin`
- `send_message_admin_to_customer`
- `send_message_customer_to_admin`

## Repository Metadata

Suggested description:

```text
Express and MongoDB marketplace API with auth, products, orders, Stripe payments, Cloudinary uploads, Socket.IO chat, seed data, Docker, and Swagger docs.
```

Suggested topics:

```text
nodejs, express, mongodb, mongoose, ecommerce, marketplace, rest-api, socket-io, stripe, cloudinary, swagger, docker
```

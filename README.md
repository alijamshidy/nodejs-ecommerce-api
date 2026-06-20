# Backend - E-commerce Marketplace API

> **فارسی:** REST API و WebSocket server برای یک پلتفرم فروشگاهی چندفروشنده. احراز هویت، محصولات، سبد خرید، سفارش، Stripe و چت real-time را پشتیبانی می‌کند.

REST API and WebSocket server for a multi-vendor e-commerce marketplace. Supports authentication, product management, cart, orders, Stripe payments, and real-time chat between customers, sellers, and admins.

## Tech Stack

| Layer       | Technology             |
| ----------- | ---------------------- |
| Runtime     | Node.js 20             |
| Framework   | Express 4              |
| Database    | MongoDB (Mongoose 8)   |
| Real-time   | Socket.IO 4            |
| Auth        | JWT (cookie-based)     |
| File upload | Cloudinary             |
| Payments    | Stripe Connect         |
| API Docs    | Swagger UI (OpenAPI 3) |

## API Documentation (Swagger)

Interactive API docs are available when the server is running:

| URL                                   | Description                               |
| ------------------------------------- | ----------------------------------------- |
| `http://localhost:5000/api-docs`      | Swagger UI — try endpoints in the browser |
| `http://localhost:5000/api-docs.json` | Raw OpenAPI 3.0 JSON spec                 |

OpenAPI spec source files live in `docs/openapi/`. To add or update an endpoint, edit the matching file under `docs/openapi/paths/` and restart the server.

**Testing authenticated routes in Swagger UI:** Log in via `/admin-login` or `/seller-login` first (this sets the `accessToken` cookie). Swagger is configured with `withCredentials: true` so cookies are sent on subsequent requests.

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ (recommended: 20)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (optional)

## Quick Start

### 1. Clone and install

```bash
git clone https://github.com/alijamshidy/ecommerce-backend.git
cd backend
npm install
```

### 2. Environment variables

```bash
cp .env.example .env
```

Edit `.env`:

| Variable            | Description                   |
| ------------------- | ----------------------------- |
| `PORT`              | Server port (default: `5000`) |
| `DB_URL`            | MongoDB connection string     |
| `SECRET`            | JWT signing secret            |
| `cloud_name`        | Cloudinary cloud name         |
| `api_key`           | Cloudinary API key            |
| `api_secret`        | Cloudinary API secret         |
| `STRIPE_SECRET_KEY` | Stripe secret key             |

### 3. Run locally

```bash
npm run dev
```

Server runs at `http://localhost:5000`.

Open Swagger docs at `http://localhost:5000/api-docs`.

## Docker

```bash
cp .env.example .env
docker compose up --build
```

| Service    | URL / Port                       |
| ---------- | -------------------------------- |
| API        | `http://localhost:5000`          |
| Swagger UI | `http://localhost:5000/api-docs` |
| MongoDB    | `localhost:27017`                |

Useful commands:

```bash
docker compose up -d --build
docker compose logs -f backend
docker compose down
docker compose down -v
```

> In Docker Compose, `DB_URL` is overridden to `mongodb://mongodb:27017/myapp_db`.

On first startup, MongoDB loads sample data from `init_data/init.js`. A `seed` service also runs before the API starts and fills any empty collections.

## Seed Data

The project includes 120+ sample records per main collection (150 products, plus orders, reviews, cart, wishlist, categories, sellers, customers, and CMS content).

**Test accounts** (password for all: `123456`):

| Role     | Email examples                          |
| -------- | --------------------------------------- |
| Admin    | `a@admin.com`                           |
| Seller   | `seller1@test.com` … `seller120@test.com` |
| Customer | `customer1@test.com` … `customer120@test.com` |

### Local seed commands

```bash
# Seed if collections are empty
npm run seed

# Drop and reseed all sample collections
npm run seed:force

# Regenerate init_data/init.js from seed/build-data.js
npm run seed:generate
```

### Docker seed commands

```bash
# Full stack (MongoDB + seed + API)
docker compose up --build

# Manual reseed without deleting the volume
docker compose run --rm seed node seed/seed.js --force

# Fresh database (removes MongoDB volume, reruns init_data on next up)
docker compose down -v
docker compose up --build
```

Seed source files:

| Path | Purpose |
| ---- | ------- |
| `seed/build-data.js` | Shared data generator |
| `seed/seed.js` | Mongoose seeder (`--force` to replace) |
| `seed/generate-init.js` | Writes `init_data/init.js` for MongoDB first boot |
| `init_data/init.js` | Auto-loaded by MongoDB on empty volume |

## Scripts

| Command               | Description                              |
| --------------------- | ---------------------------------------- |
| `npm start`           | Production (`node server.js`)            |
| `npm run dev`         | Development with nodemon                 |
| `npm run server`      | Alias for `dev`                          |
| `npm run seed`        | Insert sample data (skip existing)       |
| `npm run seed:force`  | Drop and reseed sample collections       |
| `npm run seed:generate` | Regenerate `init_data/init.js`         |

## Project Structure

```
backend/
├── server.js                 # Entry point - Express + Socket.IO
├── controllers/              # Business logic
├── routes/                   # Route definitions (mounted under /api)
├── models/                   # Mongoose schemas
├── middlewares/              # authMiddleware (JWT from cookies)
├── utils/                   # Shared helpers (db, token, response)
├── docs/
│   ├── swagger.js           # Swagger UI setup
│   └── openapi/             # OpenAPI 3 spec (paths, components)
├── seed/                    # Sample data generator and seeder
├── init_data/               # MongoDB init script (Docker first boot)
├── Dockerfile
├── docker-compose.yml
└── .env.example
```

## API Overview

All REST routes are mounted under the `/api` prefix.

### Authentication

| Method | Path                          | Auth | Description           |
| ------ | ----------------------------- | ---- | --------------------- |
| POST   | `/admin-login`                | -    | Admin login           |
| POST   | `/seller-register`            | -    | Seller registration   |
| POST   | `/seller-login`               | -    | Seller login          |
| GET    | `/get-user`                   | yes  | Current user info     |
| POST   | `/profile-image-upload`       | yes  | Upload profile image  |
| POST   | `/profile-info-add`           | yes  | Update profile        |
| GET    | `/logout`                     | yes  | Logout                |
| POST   | `/customer/customer-register` | -    | Customer registration |
| POST   | `/customer/customer-login`    | -    | Customer login        |
| GET    | `/customer/logout`            | -    | Customer logout       |

### Dashboard (Admin / Seller)

| Method | Path                      | Auth | Description             |
| ------ | ------------------------- | ---- | ----------------------- |
| POST   | `/category-add`           | yes  | Add category            |
| GET    | `/category-get`           | yes  | List categories         |
| POST   | `/product-add`            | yes  | Add product             |
| GET    | `/products-get`           | yes  | Seller products         |
| GET    | `/product-get/:productId` | yes  | Product details         |
| POST   | `/product-update`         | yes  | Update product          |
| POST   | `/product-image-update`   | yes  | Update product image    |
| GET    | `/request-seller-get`     | yes  | Pending seller requests |
| GET    | `/get-seller/:sellerId`   | yes  | Seller details          |
| POST   | `/seller-status-update`   | yes  | Update seller status    |
| GET    | `/get-sellers`            | yes  | Active sellers          |
| GET    | `/get-deactive-sellers`   | yes  | Inactive sellers        |

### Storefront (Home)

| Method | Path                                   | Description       |
| ------ | -------------------------------------- | ----------------- |
| GET    | `/home/get-category`                   | Public categories |
| GET    | `/home/get-product`                    | Products          |
| GET    | `/home/price-range-latest-product`     | Price filter      |
| GET    | `/home/query-products`                 | Search products   |
| GET    | `/home/product-details/:slug`          | Product details   |
| POST   | `/home/customer/submit-review`         | Submit review     |
| GET    | `/home/customer/get-review/:productId` | Product reviews   |

### Cart and Wishlist

| Method | Path                                                | Description          |
| ------ | --------------------------------------------------- | -------------------- |
| POST   | `/home/product/add-to-card`                         | Add to cart          |
| GET    | `/home/product/get-card-products/:userId`           | Cart items           |
| DELETE | `/home/product/delete-card-product/:card_id`        | Remove from cart     |
| PUT    | `/home/product/quantity-inc/:card_id`               | Increase quantity    |
| PUT    | `/home/product/quantity-dec/:card_id`               | Decrease quantity    |
| POST   | `/home/product/add-to-wishlist`                     | Add to wishlist      |
| GET    | `/home/product/get-wishlist-products/:userId`       | Wishlist items       |
| DELETE | `/home/product/remove-wishlist-product/:wishlistId` | Remove from wishlist |

### Orders

| Method | Path                                            | Description          |
| ------ | ----------------------------------------------- | -------------------- |
| POST   | `/home/order/place-order`                       | Place order          |
| GET    | `/home/customer/get-dashboard-data/:userId`     | Customer dashboard   |
| GET    | `/home/customer/get-orders/:customerId/:status` | Customer orders      |
| GET    | `/home/customer/get-order-details/:orderId`     | Order details        |
| GET    | `/admin-orders`                                 | Admin orders         |
| GET    | `/admin/order/:orderId`                         | Admin order details  |
| PUT    | `/admin/order-status/update/:orderId`           | Admin status update  |
| GET    | `/seller/orders/:sellerId`                      | Seller orders        |
| GET    | `/seller/order/:orderId`                        | Seller order details |
| PUT    | `/seller/order-status/update/:orderId`          | Seller status update |

### Chat and Payments

| Method | Path                                            | Auth | Description                |
| ------ | ----------------------------------------------- | ---- | -------------------------- |
| POST   | `/chat/customer/add-customer-friend`            | -    | Add chat friend            |
| POST   | `/chat/customer/send-message-to-seller`         | -    | Customer to seller message |
| GET    | `/chat/seller/get-customers/:sellerId`          | -    | Seller customers           |
| GET    | `/chat/seller/get-customer-message/:customerId` | yes  | Message history            |
| POST   | `/chat/seller/send-message-to-customer`         | yes  | Seller to customer message |
| GET    | `/chat/admin/get-sellers`                       | yes  | Sellers for admin          |
| POST   | `/chat/message-send-seller-admin`               | yes  | Seller-admin message       |
| GET    | `/chat/get-admin-message/:receverId`            | yes  | Admin messages             |
| GET    | `/chat/get-seller-message`                      | yes  | Seller messages            |
| GET    | `/payment/create-stripe-connect-account`        | yes  | Stripe Connect account     |

## Socket.IO Events

**Client to Server:** `add_user`, `add_seller`, `add_admin`, `send_seller_message`, `send_customer_message`, `send_message_admin_to_seller`, `send_message_seller_to_admin`

**Server to Client:** `activeSeller`, `seller_message`, `customer_message`, `receved_admin_message`, `receved_seller_message`

## Authentication

- JWT stored in `accessToken` cookie
- Protected routes use `authMiddleware`
- After verify: `req.role` and `req.id` are available
- CORS enabled for `http://localhost:3000` and `http://localhost:3001` with `credentials: true`

## Frontend Integration

1. Send requests with `credentials: 'include'` for cookies
2. Connect from allowed CORS origins
3. Connect Socket.IO client to the same API host/port

## Troubleshooting

| Problem                       | Solution                                          |
| ----------------------------- | ------------------------------------------------- |
| No `database connected..` log | Check `DB_URL` and MongoDB access                 |
| `409 Please Login`            | Missing or expired `accessToken` cookie           |
| Docker build fails            | Start Docker Desktop                              |
| CORS error                    | Add frontend origin in `server.js`                |
| bcrypt install error          | Use Node 20+ and build tools (included in Docker) |

## Related Docs

- [AGENTS.md](AGENTS.md) - guidelines for AI coding agents

## License

ISC

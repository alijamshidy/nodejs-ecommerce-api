# AGENTS.md — AI Agent Guide

Instructions for AI coding agents working on this repository.

## Project Summary

Node.js/Express backend for a multi-vendor e-commerce marketplace. Three user roles: **admin**, **seller**, **customer**. Features include JWT auth, product/category CRUD, cart/wishlist, orders, reviews, REST + Socket.IO chat, Cloudinary uploads, and Stripe Connect.

Entry point: `server.js` (Express HTTP + Socket.IO on the same port).

## Tech Stack

- **Runtime:** Node.js 20 (CommonJS — `require` / `module.exports`, no TypeScript)
- **HTTP:** Express 4, body-parser, cookie-parser, cors
- **Database:** MongoDB via Mongoose 8
- **Real-time:** Socket.IO 4 (in-memory user tracking in `server.js`)
- **Auth:** JWT in `accessToken` cookie, 7-day expiry (`utiles/tokenCreate.js`)
- **Uploads:** Cloudinary + formidable
- **Payments:** Stripe Connect

## Directory Layout

```
server.js              # App bootstrap, middleware, route mounting, Socket.IO
controllers/           # Business logic — one export per handler function
routes/                # Express routers, mounted at /api in server.js
models/                # Mongoose schemas
middlewares/           # authMiddleware.js — JWT verification from cookies
utiles/                # Shared utilities (note: folder is "utiles", not "utils")
  db.js                # mongoose.connect(process.env.DB_URL)
  tokenCreate.js       # JWT sign helper
  response.js          # responseReturn(res, code, data)
  queryProducts.js     # Product search/filter helper
```

### Route → Controller Mapping

| Route file | Domain |
|------------|--------|
| `routes/authRoutes.js` | Admin/seller auth & profile |
| `routes/home/customerAuthRoutes.js` | Customer auth |
| `routes/dashboard/categoryRoutes.js` | Category CRUD |
| `routes/dashboard/productRoutes.js` | Product CRUD |
| `routes/dashboard/sellerRoutes.js` | Seller management (admin) |
| `routes/home/homeRoutes.js` | Public storefront & reviews |
| `routes/home/cardRoutes.js` | Cart & wishlist |
| `routes/order/orderRoutes.js` | Orders (customer/admin/seller) |
| `routes/chatRoutes.js` | Chat REST endpoints |
| `routes/paymentRoutes.js` | Stripe Connect |

## Environment Variables

Required in `.env` (see `.env.example`):

```
PORT
DB_URL
SECRET
cloud_name
api_key
api_secret
STRIPE_SECRET_KEY
```

Docker Compose overrides `DB_URL` to `mongodb://mongodb:27017/backend` for the backend service.

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Development with nodemon
npm start            # Production (node server.js)
docker compose up --build   # Run with MongoDB
```

No test suite exists. Do not add tests unless explicitly requested.

## Coding Conventions

### Style (match existing code)

- CommonJS modules throughout
- Controller functions use `snake_case` naming (e.g. `seller_register`, `add_product`)
- Route paths use `kebab-case` (e.g. `/product-add`, `/get-sellers`)
- Models use PascalCase filenames with camelCase schema fields
- Responses go through `responseReturn(res, code, data)` from `utiles/response.js`
- Async handlers use `async/await`; errors often return via `responseReturn` with status 500/409

### Auth pattern

Protected routes use `authMiddleware` which reads `req.cookies.accessToken`, verifies with `process.env.SECRET`, and sets `req.role` and `req.id`.

```js
const { authMiddleware } = require('../middlewares/authMiddleware');
router.get('/some-route', authMiddleware, controller.handler);
```

### Adding a new API endpoint

1. Add handler in the appropriate `controllers/` file
2. Register route in matching `routes/` file
3. If protected, wrap with `authMiddleware`
4. If new collection needed, create schema in `models/`
5. Mount is already handled — all routes use `/api` prefix in `server.js`

### Image uploads

Cloudinary config is inline in controllers (not centralized):

```js
cloud_name: process.env.cloud_name,
api_key: process.env.api_key,
api_secret: process.env.api_secret,
```

Use formidable for parsing multipart form data when adding upload endpoints.

### Socket.IO

Real-time chat logic lives directly in `server.js` (not in controllers). In-memory arrays track online users: `allCustomer`, `allSeller`, `admin`. When modifying chat behavior, check both REST routes (`routes/chatRoutes.js`) and socket events in `server.js`.

## Do

- Follow the existing controller → route → model layering
- Use `responseReturn` for JSON responses
- Read env vars via `process.env.*` (dotenv loaded in `server.js`)
- Keep changes minimal and focused on the requested task
- Use `npm start` / Docker for production runs; `npm run dev` for local development
- Preserve the `utiles/` folder name (do not rename to `utils` without explicit request)

## Do Not

- Convert to TypeScript or ESM unless explicitly asked
- Rename existing API paths or response shapes (frontend depends on them)
- Commit `.env` or secrets
- Over-engineer with abstractions the codebase doesn't use (no service layer, no DI)
- Add extensive error handling or comments for obvious code
- Change CORS origins without noting frontend impact (`localhost:3000`, `localhost:3001`)
- Run destructive git commands or modify git config

## Common Tasks

### Add env variable

1. Add to `.env.example` with a placeholder
2. Read via `process.env.VAR_NAME` where needed
3. If Docker-relevant, document in README.md

### Add CORS origin

Edit the `cors({ origin: [...] })` block in `server.js`.

### Debug DB connection

Check `utiles/db.js` — connection uses `process.env.DB_URL`. Logs `database connected..` on success.

## Git Workflow

- Use conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`
- Reference GitLab issues as `#<number>` in commits and MR descriptions
- Only commit when the user explicitly asks

## Related Docs

- `README.md` — human-facing setup, API reference, Docker instructions

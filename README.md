# Node.js E-Commerce API

A comprehensive **E-Commerce Backend API** built with **Node.js, Express, and MongoDB**. This API provides all the essential features for an e-commerce platform including user authentication, product management, order processing, payment handling, and real-time chat.

---

## 📸 Screenshot
*(Add your API documentation screenshot here - e.g., Swagger UI or Postman collection)*

---

## ✨ Features

### 🔐 **Authentication & Authorization**
- User registration and login with JWT
- Role-based access control (Admin, Seller, Customer)
- Password hashing with bcrypt
- Cookie-based authentication

### 🛍 **Product Management**
- CRUD operations for products
- Category and collection management
- Product search and filtering
- Image upload with Cloudinary

### 💳 **Order & Payment**
- Order creation and management
- Payment gateway integration
- Order status tracking
- Refund processing

### 📊 **Dashboard**
- Admin dashboard with analytics
- Seller dashboard for product management
- Report generation
- Sales statistics

### 💬 **Real-time Features**
- Customer support chat
- Real-time notifications

### 📝 **Content Management**
- Blog and content management
- FAQ and help center

---

## 🛠 Tech Stack

**Backend Framework:**
- [Node.js](https://nodejs.org/) - JavaScript runtime
- [Express.js](https://expressjs.com/) - Web framework

**Database:**
- [MongoDB](https://www.mongodb.com/) - NoSQL database
- [Mongoose](https://mongoosejs.com/) - ODM library

**Authentication:**
- [JSON Web Tokens (JWT)](https://jwt.io/) - Secure token-based auth
- [bcrypt](https://www.npmjs.com/package/bcrypt) - Password hashing
- [cookie-parser](https://www.npmjs.com/package/cookie-parser) - Cookie handling

**File Upload & Storage:**
- [Cloudinary](https://cloudinary.com/) - Image and file storage
- [formidable](https://www.npmjs.com/package/formidable) - File upload handling

**Utilities:**
- [dotenv](https://www.npmjs.com/package/dotenv) - Environment variables
- [cors](https://www.npmjs.com/package/cors) - Cross-origin support
- [moment](https://momentjs.com/) - Date/time handling

**Development Tools:**
- [ESLint](https://eslint.org/) - Code linting
- [Docker](https://www.docker.com/) - Containerization

---

## 💻 Installation

### Prerequisites
- Node.js (v18 or later)
- MongoDB (local or Atlas)
- Git

### Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/alijamshidy/nodejs-ecommerce-api.git
   cd nodejs-ecommerce-api
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file with your configuration (see [Environment Variables](#-environment-variables))

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Run with Docker (optional):**
   ```bash
   docker-compose up -d
   ```

The server will start at `http://localhost:5000`

---

## ⚙ Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
DB_URL=mongodb://localhost:27017/myapp_db

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=30d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Cookie Configuration
COOKIE_EXPIRES=30

# Payment Gateway (Stripe example)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

---

## 📁 Folder Structure

```
nodejs-ecommerce-api/
├── controllers/           # Route controllers
│   ├── authControllers.js
│   ├── chat/
│   ├── content/
│   ├── dashboard/
│   ├── home/
│   ├── order/
│   └── payment/
├── models/               # MongoDB models
│   ├── Chat/
│   └── content/
├── routes/               # API routes
│   ├── content/
│   ├── dashboard/
│   ├── home/
│   ├── order/
│   └── payment/
├── middlewares/          # Express middlewares
├── utils/                # Utility functions
├── seed/                 # Database seeding scripts
├── init_data/            # Initial data
├── docs/                 # API documentation
│   └── openapi/
│       ├── components.js
│       ├── index.js
│       └── paths/
├── .env.example           # Environment variables template
├── .dockerignore
├── AGENTS.md
├── package.json
└── README.md
```

---

## 🚀 Demo

### Run the API locally:
```bash
npm run dev
```

### Test with Postman/Thunder Client:
- Import the Postman collection (if available)
- Base URL: `http://localhost:5000/api`

### API Documentation:
- **Swagger/OpenAPI docs available at:** `/api-docs` (if configured)
- **Postman collection:** Available in `docs/` directory

---

## 📡 API Documentation

### Base URL
```
https://your-domain.com/api/v1
```

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/v1/auth/register` | Register new user | Public |
| POST | `/api/v1/auth/login` | User login | Public |
| POST | `/api/v1/auth/logout` | User logout | Private |
| GET | `/api/v1/auth/me` | Get current user | Private |

### Product Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/v1/products` | Get all products | Public |
| GET | `/api/v1/products/:id` | Get single product | Public |
| POST | `/api/v1/products` | Create product | Seller/Admin |
| PUT | `/api/v1/products/:id` | Update product | Seller/Admin |
| DELETE | `/api/v1/products/:id` | Delete product | Seller/Admin |

### Order Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/v1/orders` | Get user orders | Private |
| GET | `/api/v1/orders/:id` | Get order details | Private |
| POST | `/api/v1/orders` | Create new order | Private |
| PUT | `/api/v1/orders/:id/cancel` | Cancel order | Private |

### Category & Collection Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/v1/categories` | Get all categories | Public |
| POST | `/api/v1/categories` | Create category | Admin |
| GET | `/api/v1/collections` | Get all collections | Public |
| POST | `/api/v1/collections` | Create collection | Admin |

### Payment Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/v1/payment/create` | Create payment intent | Private |
| POST | `/api/v1/payment/confirm` | Confirm payment | Private |
| GET | `/api/v1/payment/:id` | Get payment details | Private |

### Chat Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/v1/chat` | Get user chats | Private |
| POST | `/api/v1/chat` | Start new chat | Private |
| POST | `/api/v1/chat/:id/message` | Send message | Private |

### Dashboard Endpoints (Admin/Seller)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/v1/dashboard/stats` | Get dashboard statistics | Admin |
| GET | `/api/v1/dashboard/sales` | Get sales reports | Admin |
| GET | `/api/v1/dashboard/users` | Get users list | Admin |

---

## 📦 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run start` | Start production server |
| `npm run test` | Run tests |
| `npm run lint` | Run ESLint |
| `npm run seed` | Seed database with initial data |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

This project is **private** and all rights are reserved.

---

## 🆘 Support

For support, please open an issue or contact the maintainer.

---

## 🏷 Topics

`nodejs`, `express`, `mongodb`, `mongoose`, `ecommerce`, `api`, `rest-api`, `jwt-authentication`, `cloudinary`, `docker`, `backend`, `javascript`
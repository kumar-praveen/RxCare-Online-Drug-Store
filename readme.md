# RxCare - Online Drug Store 💊

> **RxCare** is a full-stack MERN-based online drug store application that allows users to browse, search, and purchase medicines and healthcare products with ease. It provides a seamless experience for patients, customers, and administrators to manage prescriptions, orders, and inventory.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## ✨ Features

### 👤 User Features
- 🔐 User Registration & Login (JWT Authentication)
- 🔍 Search and filter medicines by name, category, or brand
- 🛒 Add to Cart & Wishlist
- 📦 Place and track orders
- 💳 Secure payment integration
- 📄 Upload and manage prescriptions
- 📜 Order history and invoice download
- 👤 User profile management

### 🛡️ Admin Features
- 📊 Admin dashboard with analytics
- 💊 Add, update, and delete medicines/products
- 📦 Manage orders and update order status
- 👥 Manage users and their roles
- 📋 Inventory management and stock alerts
- 🗂️ Category and brand management

### 🌟 General Features
- 📱 Fully Responsive Design (Mobile & Desktop)
- 🌙 Dark / Light Mode Toggle
- 🔔 Real-time Notifications
- ⭐ Product Ratings and Reviews
- 🏷️ Discount and Coupon Management

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js, Redux Toolkit, React Router DOM |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Authentication** | JWT (JSON Web Tokens), bcryptjs |
| **File Upload** | Multer, Cloudinary |
| **Payment** | Razorpay |
| **Styling** | Tailwind CSS / PreBuilt UI |
| **State Management** | Redux Toolkit |
| **API Testing** | Postman |
| **Version Control** | Git & GitHub |

---

## 📁 Project Structure

RxCare/
│
├── frontend/ # React Frontend
│ ├── public/
│ └── src/
│ ├── assets/ # Images, icons, fonts
│ ├── components/ # Reusable UI components
│ │ ├── Navbar.jsx
│ │ ├── Footer.jsx
│ │ ├── ProductCard.jsx
│ │ └── ...
│ ├── pages/ # Application pages
│ │ ├── Home.jsx
│ │ ├── ProductList.jsx
│ │ ├── ProductDetail.jsx
│ │ ├── Cart.jsx
│ │ ├── Checkout.jsx
│ │ ├── Login.jsx
│ │ ├── Register.jsx
│ │ └── admin/
│ │ ├── Dashboard.jsx
│ │ ├── ManageProducts.jsx
│ │ └── ManageOrders.jsx
│ ├── redux/ # Redux store and slices
│ │ ├── store.js
│ │ ├── authSlice.js
│ │ ├── cartSlice.js
│ │ └── productSlice.js
│ ├── services/ # Axios API calls
│ ├── utils/ # Helper functions
│ ├── App.jsx
│ └── main.jsx
│
├── backend/ # Node.js + Express Backend
│ ├── config/
│ │ └── db.js # MongoDB connection
│ ├── controllers/
│ │ ├── authController.js
│ │ ├── productController.js
│ │ ├── orderController.js
│ │ └── userController.js
│ ├── middleware/
│ │ ├── authMiddleware.js
│ │ ├── adminMiddleware.js
│ │ └── errorMiddleware.js
│ ├── models/
│ │ ├── User.js
│ │ ├── Product.js
│ │ ├── Order.js
│ │ ├── Category.js
│ │ └── Review.js
│ ├── routes/
│ │ ├── authRoutes.js
│ │ ├── productRoutes.js
│ │ ├── orderRoutes.js
│ │ └── userRoutes.js
│ ├── utils/
│ │ └── generateToken.js
│ └── index.js # Entry point
│
├── .env
├── .gitignore
├── package.json
└── README.md



---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (v16 or above)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas Cloud)
- [Git](https://git-scm.com/)

---

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/kumar-praveen/rx-care.git
cd rxcare

2. Install server dependencies

Bash

cd server
npm install
3. Install client dependencies

Bash

cd ../client
npm install
Environment Variables
Create a .env file inside the /server directory and add the following variables:

env

# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe Payment
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLIC_KEY=your_stripe_public_key

# Client URL
CLIENT_URL=http://localhost:3000
Create a .env file inside the /client directory:

env

VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
Running the App
Run Backend Server


cd server
npm run dev
Run Frontend Client

cd client
npm run dev
Run Both Concurrently (from root)


npm run dev
The app will be running at:

Frontend: http://localhost:3000
Backend: http://localhost:5000
📡 API Endpoints
🔐 Auth Routes
Method	Endpoint	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	Login user
POST	/api/auth/logout	Logout user
GET	/api/auth/profile	Get current user profile
💊 Product Routes
Method	Endpoint	Description
GET	/api/products	Get all products
GET	/api/products/:id	Get single product
POST	/api/products	Add new product (Admin)
PUT	/api/products/:id	Update product (Admin)
DELETE	/api/products/:id	Delete product (Admin)
📦 Order Routes
Method	Endpoint	Description
POST	/api/orders	Place a new order
GET	/api/orders	Get all orders (Admin)
GET	/api/orders/my-orders	Get logged-in user orders
GET	/api/orders/:id	Get order by ID
PUT	/api/orders/:id/status	Update order status (Admin)
👥 User Routes
Method	Endpoint	Description
GET	/api/users	Get all users (Admin)
GET	/api/users/:id	Get user by ID
PUT	/api/users/:id	Update user profile
DELETE	/api/users/:id	Delete user (Admin)
📸 Screenshots
Page	Preview
🏠 Home Page	Home
💊 Product Listing	Products
🛒 Cart Page	Cart
📊 Admin Dashboard	Admin
🤝 Contributing
Contributions are always welcome! Here's how you can help:

Fork the repository
Create a new branch
Bash

git checkout -b feature/your-feature-name
Commit your changes
Bash

git commit -m "Add: your feature description"
Push to your branch
Bash

git push origin feature/your-feature-name
Open a Pull Request
Please read our CONTRIBUTING.md for more details.

🐛 Known Issues / Future Improvements
 Add real-time chat support for pharmacists
 Integrate AI-based medicine recommendations
 Add multi-language support
 Implement subscription-based medicine delivery
 Push notification support
📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

📬 Contact
Your Name

📧 Email: yourname@email.com
💼 LinkedIn: linkedin.com/in/yourprofile
🐙 GitHub: github.com/yourusername
# 📦 Inventory Microservice with NestJS

A modern, scalable, and decoupled **Microservices Architecture** built using **NestJS**, **TypeScript**, **TCP Transport Protocol**, **TypeORM**, and **PostgreSQL**. 

This system consists of an **API Gateway** serving as the entry point for client HTTP REST requests, which securely communicates with an underlying **Inventory Microservice** over internal TCP connections.

---

## 🏛️ System Architecture

```text
 Client (HTTP / REST)
        │
        ▼
┌─────────────────────────┐
│       API Gateway       │  <-- Port 3000 (HTTP REST API, JWT Auth, Validation)
└───────────┬─────────────┘
            │  TCP Protocol (Message Patterns)
            ▼
┌─────────────────────────┐
│   Inventory Microservice │ <-- Port 3001 (TCP Server)
└───────────┬─────────────┘
            │  TypeORM
            ▼
┌─────────────────────────┐
│   PostgreSQL Database   │ <-- Port 5432 (inventory_db)
└─────────────────────────┘
```

---

## ✨ Key Features & Technical Details

- **🌐 REST API Gateway (`api-gateway`)**:
  - Exposes public REST endpoints on HTTP port `3000`.
  - Routes traffic to the inventory microservice using NestJS `ClientProxy` and TCP transport.
  - Custom JWT Authentication (`AuthGuard`) protecting sensitive write operations.
  - Global `ValidationPipe` leveraging `class-validator` & `class-transformer` for strict DTO payload verification.
  - Custom HTTP request logging middleware.

- **⚡ Inventory Microservice (`inventory-service`)**:
  - Standalone TCP Microservice listening on port `3001`.
  - Implements NestJS `@MessagePattern()` for decoupled request-response handling.
  - Manages product catalog and inventory stock levels.
  - Handles stock purchase/checkout operations (`checkout_order`).

- **🗄️ Database & ORM**:
  - Powered by **PostgreSQL** (`inventory_db`).
  - Integrated via **TypeORM** (`@nestjs/typeorm`) with auto-entity synchronization in dev environment.
  - Includes `Product` entity with fields: `id` (PK), `name` (unique), and `stock` (default: 0).

---

## 🛠️ Technology Stack

| Domain | Technology / Tool |
| :--- | :--- |
| **Framework** | [NestJS v11](https://nestjs.com/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Microservice Transport** | TCP (`@nestjs/microservices`) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) |
| **ORM** | [TypeORM](https://typeorm.io/) |
| **Authentication** | JSON Web Tokens (`@nestjs/jwt`) |
| **Validation** | `class-validator` & `class-transformer` |
| **Testing** | Jest |

---

## 📂 Project Structure

```text
inventory-microservice-nestjs/
├── api-gateway/            # HTTP REST Gateway (Port 3000)
│   ├── src/
│   │   ├── dto/            # Data Transfer Objects (Validation DTOs)
│   │   ├── app.controller.ts  # REST Endpoints & ClientProxy forwarding
│   │   ├── app.module.ts      # Gateway module & JWT configuration
│   │   ├── auth.guards.ts     # JWT Authorization Guard
│   │   └── main.ts            # Entry point (ValidationPipe, Port 3000)
│   └── package.json
│
└── inventory-service/      # TCP Inventory Microservice (Port 3001)
    ├── src/
    │   ├── dto/            # Inventory DTOs
    │   ├── inventory.controller.ts # Message Pattern handlers
    │   ├── inventory.service.ts    # Business logic & Database queries
    │   ├── inventory.module.ts     # TypeORM & PostgreSQL configuration
    │   ├── product.entity.ts       # TypeORM Product Entity
    │   └── main.ts                 # Entry point (TCP Microservice, Port 3001)
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18+ recommended)
- **npm** or **yarn**
- **PostgreSQL** running locally on port `5432` with a database named `inventory_db`

### 1️⃣ Database Setup

Ensure PostgreSQL is running with the following credentials (or adjust in `inventory-service/src/inventory.module.ts`):
- **Host**: `localhost`
- **Port**: `5432`
- **User**: `postgres`
- **Password**: `password`
- **Database**: `inventory_db`

### 2️⃣ Install Dependencies

Install dependencies for both microservices:

```bash
# Install API Gateway dependencies
cd api-gateway
npm install

# Install Inventory Service dependencies
cd ../inventory-service
npm install
```

### 3️⃣ Running the Microservices

Start both services in development mode:

#### Terminal 1: Start Inventory Microservice (Port 3001)
```bash
cd inventory-service
npm run start:dev
```

#### Terminal 2: Start API Gateway (Port 3000)
```bash
cd api-gateway
npm run start:dev
```

---

## 📡 API Endpoints & Microservice Messages

### 🔐 Authentication

- `GET /products/login`
  - Generates a test JWT bearer access token.

### 🛍️ Products (REST API Gateway -> TCP Microservice)

| Method | Endpoint | Auth Required | TCP Message Pattern | Description |
| :--- | :--- | :---: | :--- | :--- |
| `GET` | `/products` | ❌ | `get_all_products` | Retrieve all inventory products |
| `GET` | `/products/:id` | ❌ | `get_product_with_id` | Retrieve product details by ID |
| `POST` | `/products` | 🔒 Yes | `create_new_product` | Create a new product |
| `PUT` | `/products/:id` | 🔒 Yes | `update_product` | Update product details |
| `DELETE` | `/products/:id` | 🔒 Yes | `delete_product` | Delete product by ID |
| `POST` | `/products/buy/:id` | 🔒 Yes | `checkout_order` | Purchase stock for a product |

---

## 🔒 Authentication Header Example

For protected routes (`POST`, `PUT`, `DELETE`, `POST /buy/:id`), include the JWT token in the request header:

```http
Authorization: Bearer <YOUR_ACCESS_TOKEN>
```

---

## 🧪 Testing & Linting

```bash
# Run unit tests
npm run test

# Run linter
npm run lint
```

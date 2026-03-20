# My Payload Project

A full-featured e-commerce CMS platform built with **Payload CMS** and **Next.js**, supporting customer management, product catalogs, order processing, and rich content management.

---

## Table of Contents

- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Modules & Features](#modules--features)
- [Access Control](#access-control)
- [Getting Started](#getting-started)
- [Testing](#testing)
- [Project Structure](#project-structure)

---

## Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| CMS Backend | Payload CMS | 3.65.0 |
| Web Framework | Next.js (App Router) | 15.4.7 |
| UI Library | React | 19.1.0 |
| Database | MongoDB (Mongoose adapter) | — |
| Runtime | Node.js | >=18.20.2 or >=20.9.0 |
| API | Express + GraphQL | 5.1.0 / 16.8.1 |
| Validation | Zod | 4.1.13 |
| Rich Text | Lexical Editor | — |
| Testing (Unit/Int) | Vitest | 3.2.3 |
| Testing (E2E) | Playwright | 1.56.1 |
| Language | TypeScript | 5.7.3 |
| Package Manager | pnpm | — |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Next.js Application                    │
├──────────────────────────┬──────────────────────────────────┤
│     Frontend Routes      │          API Routes              │
│     (Next.js Pages)      │     (Payload Endpoints)          │
├──────────────────────────┼──────────────────────────────────┤
│  (frontend)/             │  (payload)/api/[...slug]         │
│  - Home page             │  - Customer endpoints            │
│  - Product catalog       │  - Order endpoints               │
│  - Blog                  │  - Product endpoints             │
│  - Contact               │  - Category / Type / Model       │
│                          │  - Variant / Blog / Media        │
│                          │  - Address / Contact Request     │
├──────────────────────────┼──────────────────────────────────┤
│  (payload)/admin         │  GraphQL Endpoint                │
│  - CMS Dashboard         │  - /api/graphql                  │
│  - Collection CRUD       │  - /api/graphql-playground       │
│  - Global Settings       │                                  │
└──────────────────────────┴──────────────────────────────────┘
                               │
                               ▼
                      ┌─────────────────┐
                      │   Payload CMS   │
                      │  Collections    │
                      │  Globals        │
                      │  Access Control │
                      │  Validators     │
                      └─────────────────┘
                               │
                               ▼
                       ┌──────────────┐
                       │   MongoDB    │
                       └──────────────┘
```

**Request Flow:**
1. Client sends request to Next.js application
2. App Router directs to frontend page or API handler
3. Payload CMS processes API requests through custom endpoints
4. Controllers validate input via Zod schemas
5. Access control checks enforce role-based permissions
6. Data is read from / written to MongoDB via Mongoose

---

## Modules & Features

### Collections (Data Models)

| Collection | Description | Access |
|-----------|-------------|--------|
| **Admin** | System administrators | Admin only |
| **Customer** | Registered end users with address book and order history | Public create, customer update, admin delete |
| **Product** | Product catalog with pricing and stock tracking | Public read, admin CRUD |
| **Order** | Customer orders with full lifecycle tracking | Public create/read, admin update/delete |
| **Category** | Top-level product categorization | Public read, admin CRUD |
| **Type** | Product type classification, linked to Category | Public read, admin CRUD |
| **Model** | Product models, linked to Type | Public read, admin CRUD |
| **Variant** | Product variants (color, size, etc.) | Public read, admin CRUD |
| **Blog** | Articles and content posts with rich text | Public read, admin CRUD |
| **Media** | Product image uploads (JPEG/PNG) | Public read, admin CRUD |
| **GlobalMedia** | Site-wide images used in CMS content | Admin managed |
| **ContactRequests** | Contact form submissions | Public create, admin read/manage |

### Database Relationships

```
Customer ──→ many Addresses
         └──→ many Orders

Order ──→ Customer
     └──→ many Products (via items)

Product ──→ Model ──→ Type ──→ Category
        └──→ many Variants
        └──→ many Media
```

### Controllers (Business Logic)

Each domain has dedicated controllers with full CRUD and business operations:

- **Customer** — registration, profile management, lookup
- **Order** — create, status transitions, pricing calculation
- **Product** — catalog management, stock
- **Category / Type / Model / Variant** — product taxonomy
- **Address** — customer address book, default address management
- **Blog** — article creation and retrieval
- **Media / GlobalMedia** — file upload and management
- **Contact Request** — form submission and admin retrieval

### Order Lifecycle

```
To Pay → To Ship → To Receive → Completed
                              ↘ Cancelled
```

Supported shipping carriers: Thailand Post, Kerry, Flash, J&T, DHL, FedEx

### Global CMS Content

Editable via the Payload admin panel (`/admin`):

| Global | Description |
|--------|-------------|
| **Home** | Hero slides, product showcase, brand intro |
| **Footer** | Site-wide footer configuration |
| **About Us** | About page content |
| **Blog Settings** | Blog page configuration |
| **Contact Us** | Contact page details |
| **Privacy Policy** | Legal content |
| **Terms & Conditions** | Legal content |
| **Warranty & Services** | Service and warranty information |

### API Endpoints

| Domain | Method | Endpoint |
|--------|--------|---------|
| Customer | POST | `/api/customers/create` |
| Customer | GET | `/api/customers/get-customers` |
| Customer | GET | `/api/customers/get-by-id/:id` |
| Order | POST | `/api/orders/create-order` |
| Order | GET | `/api/orders/get-all-orders` |
| Order | PATCH | `/api/orders/update-order/:id` |
| Product | POST | `/api/products/create-product` |
| Product | GET | `/api/products/get-all-products` |
| Address | GET | `/api/customers/:id/addresses` |
| Address | PATCH | `/api/customers/:id/addresses/:index/set-default` |
| GraphQL | POST | `/api/graphql` |
| GraphQL Playground | GET | `/api/graphql-playground` |

---

## Access Control

| Role | Permissions |
|------|------------|
| **Admin** | Full CRUD on all collections, manage content and orders |
| **Customer** | Read products/blogs, create and view own orders, manage own addresses |
| **Public** | Read products, blogs, media; submit contact forms |

---

## Getting Started

### Prerequisites

- Node.js >= 18.20.2 or >= 20.9.0
- pnpm
- MongoDB instance (local or Docker)

### Local Setup

```bash
pnpm install
cp .env.example .env   # fill in DATABASE_URI and PAYLOAD_SECRET
pnpm dev               # starts at http://localhost:3000
```

### Docker Setup

```bash
# Update MONGODB_URI in .env to: mongodb://127.0.0.1/<dbname>
# Update docker-compose.yml MONGODB_URI to match <dbname>
docker-compose up      # starts app + MongoDB
```

App available at `http://localhost:3000`. Follow on-screen instructions to create your first admin user.

### Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URI` | MongoDB connection string |
| `PAYLOAD_SECRET` | Secret key for Payload CMS session signing |

### Build & Production

```bash
pnpm build
pnpm start
```

---

## Testing

```bash
pnpm test        # all tests
pnpm test:int    # integration tests (Vitest)
pnpm test:e2e    # end-to-end tests (Playwright)
```

| Suite | Tool | Location |
|-------|------|----------|
| Integration | Vitest | `tests/int/` |
| End-to-End | Playwright | `tests/e2e/` |

---

## Project Structure

```
src/
├── app/
│   ├── (frontend)/          # Public-facing Next.js pages
│   └── (payload)/           # Payload admin + API routes
│       ├── admin/           # Admin panel
│       └── api/             # API route handlers
├── collections/             # Data model definitions (12 collections)
├── controllers/             # Business logic per domain
├── validators/              # Zod input validation schemas
├── access/                  # Role-based access policies
├── global/                  # Global CMS content definitions
├── payload.config.ts        # Payload CMS configuration
└── payload-types.ts         # Auto-generated TypeScript types
tests/
├── int/                     # Integration tests
└── e2e/                     # End-to-end tests
docker-compose.yml
next.config.mjs
```

---

## Questions

If you have any issues or questions, reach out on [Discord](https://discord.com/invite/payload) or start a [GitHub discussion](https://github.com/payloadcms/payload/discussions).

# linepete
> A competition management API, built by developers for developers.

## Project Structure
```
competition-management-api/
│
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   ├── cache.ts
│   │   └── message-queue.ts
│   ├── models/
│   │   ├── competition.ts
│   │   ├── user.ts
│   │   ├── judge.ts
│   │   └── criteria.ts
│   ├── services/
│   │   ├── user-service.ts
│   │   ├── competition-service.ts
│   │   ├── judging-service.ts
│   │   └── notification-service.ts
│   ├── controllers/
│   │   ├── competition-controller.ts
│   │   ├── user-controller.ts
│   │   └── judge-controller.ts
│   ├── middleware/
│   │   ├── auth-middleware.ts
│   │   └── validation-middleware.ts
│   ├── utils/
│   │   ├── judge-assignment-algorithm.ts
│   │   └── error-handler.ts
│   └── routes/
│       ├── competition-routes.ts
│       ├── user-routes.ts
│       └── judge-routes.ts
│
├── migrations/
├── tests/
├── package.json
└── README.md
```

## Core Technologies
- Fastify
- TypeScript
- PostgreSQL
- Redis
- RabbitMQ
- Prisma ORM
- Zod (for validation)

## Prerequisites
1. Node.js 18+
2. PostgreSQL 13+
3. Redis 6+
4. RabbitMQ 3.9+

## Installation
```bash
# Clone the repository
git clone https://github.com/OVECJOE/linepete.git

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run database migrations
npm run migrate

# Start the server
npm run start:dev
```
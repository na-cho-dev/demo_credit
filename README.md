# Demo Credit Wallet Service

## Overview

Demo Credit is a mobile lending MVP wallet service built with **NodeJS**, **TypeScript**, **KnexJS**, and **MySQL**. It enables users to register, manage wallets, fund, withdraw, and transfer funds, with blacklist checks via the Lendsqr Adjutor Karma API.

---

## Features

- **User Registration & Login**  
  Faux token-based authentication for simplicity.
- **Wallet Management**  
  - Fund wallet  
  - Withdraw funds  
  - Transfer funds to other users
- **Transaction Handling**  
  All wallet operations are tracked as transactions.
- **Blacklist Integration**  
  Users on the Adjutor Karma blacklist cannot register.
- **Error Handling**  
  Custom error classes for robust error management.
- **Database Migrations**  
  Knex migrations for users, wallets, and transactions.
- **Middleware**  
  Authentication and user validation.
- **Utilities**  
  Body parsing, response formatting, and route parameter extraction.
- **Logging**  
  Winston-based logging for development and production.
- **Unit Tests**  
  Positive and negative scenarios for core features.

---

## Tech Stack

- **NodeJS (LTS)**
- **TypeScript**
- **KnexJS ORM**
- **MySQL**
- **Winston** (logging)
- **dotenv** (environment variables)

---

## Project Structure

```
src/
  config/         # DB and environment config
  database/
    migrations/   # Knex migration files
  errors/         # Custom error classes
  handlers/       # Route handlers (auth, wallet, transaction)
  middlewares/    # Authentication middleware
  repositories/   # Data access layer
  routes/         # API route definitions
  services/       # Business logic
  utils/          # Helpers (bodyParser, logger, etc.)
  knexfile.ts     # Knex config
  server.ts       # HTTP server entrypoint
.env              # Environment variables
```

---

## API Endpoints

| Method | Path                             | Description                   | Auth Required |
|--------|----------------------------------|-------------------------------|---------------|
| POST   | `/api/auth/register`             | Register a new user           | No            |
| POST   | `/api/auth/login`                | Login user                    | No            |
| GET    | `/api/users/me`                  | Get current user profile      | Yes           |
| GET    | `/api/wallets/me`                | Get current user's wallet     | Yes           |
| GET    | `/api/wallets/:walletId/balance` | Get a user's wallet balance   | Yes           |
| POST   | `/api/transactions?limit=&page=` | View users transactions       | Yes           |
| POST   | `/api/transactions/fund`         | Fund wallet                   | Yes           |
| POST   | `/api/transactions/withdraw`     | Withdraw from wallet          | Yes           |
| POST   | `/api/transactions/transfer`     | Transfer to another wallet    | Yes           |

**Authentication:**  
Use the returned `token` as a Bearer token in the `Authorization` header:  
`Authorization: Bearer fake-token-<userId>`

---

## Request & Response Format

All API responses are in JSON format.

### Success Response

```json
{
  "success": true,
  "status": 200,
  "message": "Operation successful",
  "data": {
    // ...resource-specific fields
  }
}
```

**Example:**  
_Fetching current user wallet:_
```json
{
  "success": true,
  "status": 200,
  "message": "Wallet retrieved successfully",
  "data": {
    "id": "wallet-id",
    "user_id": "user-id",
    "balance": 1000,
    "created_at": "2024-08-02T10:00:00.000Z"
  }
}
```

---

### Error Response

```json
{
  "success": false,
  "status": 400,
  "error": "Error message describing what went wrong"
}
```

**Example:**  
_Attempting to withdraw more than balance:_
```json
{
  "success": false,
  "status": 400,
  "error": "Insufficient funds"
}
```

---

## Error Handling

- All errors return a consistent JSON structure with `success: false`, an HTTP status code, and an `error` message.
- Common error status codes:
  - `400` – Bad Request (validation errors, insufficient funds, etc.)
  - `401` – Unauthorized (missing or invalid token)
  - `403` – Forbidden (blacklisted user, forbidden action)
  - `404` – Not Found (resource does not exist)
  - `409` – Conflict (duplicate registration, etc.)
  - `500` – Internal Server Error (unexpected issues)

**Example Error Response:**
```json
{
  "success": false,
  "status": 401,
  "error": "Unauthorized: Missing token"
}
```

---

## Adjutor Karma Blacklist Integration

Adjutor Karma Blacklist Check Toggle:  
To accommodate Adjutor API limitations for unverified accounts, the blacklist check can be enabled or disabled in any environment using the `KARMA_CHECK` environment variable.

- When `KARMA_CHECK=false`, the blacklist check is bypassed, allowing user onboarding and testing to proceed even if the Adjutor API would otherwise block registration. This is useful during development or while your Adjutor account is not fully verified.
- Once your Adjutor account is verified, set `KARMA_CHECK=true` to enforce the real blacklist check in production for compliance.

On registration, the user's email is checked against the Adjutor Karma blacklist using the API key in `.env`.  
Blacklisted users are rejected with a relevant error when the check

---

## Database Design

See [`src/database/migrations/`](src/database/migrations/) for schema definitions.

### E-R Diagram

![ER Diagram](demo-credit_er_diag.png)  
<!-- <iframe width="100%" height="500px" allowtransparency="true" allowfullscreen="true" scrolling="no" title="Embedded DB Designer IFrame" frameborder="0" src='https://erd.dbdesigner.net/designer/schema/1753697251-demo-credit?embed=true'></iframe> -->

---

## Environment Variables

See [`.env.example`](.env.example):

```
NODE_ENV=development
PORT=3300

DB_HOST=localhost
DB_PORT=3306
DB_USER=
DB_PASSWORD=
DB_NAME=demo_credit_db

ADJUTOR_API_KEY=...
KARMA_CHECK=false
```

---

## Running Locally

1. **Install dependencies:**
   ```sh
   pnpm install
   ```
2. **Set up `.env` file** (see above).
3. **Run migrations:**
   ```sh
   pnpm migrate:latest
   ```
4. **Start server:**
   ```sh
   pnpm dev
   ```

---

## Testing

Unit tests cover positive and negative scenarios for registration, wallet funding, withdrawal, and transfer.

Run tests:
```sh
pnpm test
```

---

## Postman Collection

A Postman collection is provided to help you test all API endpoints easily.

- **Download:** [Demo Credit Postman Collection](./Demo_Credit_API_Service.postman_collection.json)
- **Or use online:** [Demo Credit API Service (Postman Cloud)](https://www.postman.com/nacho6/nacho-pws/collection/hs3sjuk/demo-credit-api-service?action=share&creator=38046602)

**How to use:**
1. Import the collection into Postman (or use the cloud link above).
2. Set up environment variables if needed (e.g., `base_url`, `token`).
3. Use the provided requests to test registration, login, wallet, and transaction endpoints.
4. Refer to the request descriptions for required fields and authentication details.

---

## Deployment

Deployed at:  
`https://fortune-iheanacho-lendsqr-be-test.up.railway.app`

---

## Design Decisions

- **Faux Token Auth:**  
  Simplifies authentication for MVP; tokens are generated as `fake-token-<userId>`.
- **Service Layer:**  
  Encapsulates business logic for maintainability.
- **Knex Transactions:**  
  Ensures atomicity for wallet transfers.
- **Custom Errors:**  
  Improves error reporting and handling.
- **Blacklist Check:**  
  Ensures compliance with Lendsqr requirements.

---

## Links

- **GitHub Repo:** [https://github.com/na-cho-dev/demo_credit](https://github.com/na-cho-dev/demo_credit)
- **GitHub Repo:** [https://fortune-iheanacho-lendsqr-be-test.up.railway.app/](https://fortune-iheanacho-lendsqr-be-test.up.railway.app/)
- **Design Document:** [Google Docs](https://docs.google.com/document/d/1LVBiNT5SypErJP2t1KxWs1hEbK36KmDzE9X_HCqjRJM/edit?usp=sharing)
- **Video Review:** [Loom link](https://www.loom.com/share/8170266afd7e46288756d84ac5036bfd?sid=53978e19-0530-4add-a35c-a9dc269d3bad)



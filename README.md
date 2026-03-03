# Wizkid-manager-2000 app

A production-minded REST API built with NestJS + MongoDB (Mongoose).

This project focuses on:

- Clean API design
- Role-based authorization
- Separation of concerns
- Background jobs (cron)
- Email templating
- Defensive programming
- Structured logging

## Tech Stack

- NestJS
- MongoDB + Mongoose
- JWT Authentication
- Role-based access control
- @nestjs/schedule (cron jobs)
- pnpm

## Prerequisites

- Node.js (>=18)
- pnpm
- Docker (for MongoDB)

## Run the application

## Install dependencies

```bash
cd backend && pnpm install
```

## Create `.env` file (in backend root)

```bash
PORT=3000
MONGO_URI=mongodb://localhost:27017/wizkid-manager
JWT_SECRET=supersecretkey
JWT_EXPIRES_IN=1d
AUTO_DELETE_AFTER_DAYS=7
```

## Start MongoDB

Local Mongo:

```bash
mongod
```

Or with Docker:

```bash
docker run -p 27017:27017 mongo
```

## Start backend

```bash
pnpm start:dev
```

API runs at:

```bash
http://localhost:3000
```

---

## Authentication

First you have to create a user in able to login with that user (via the POST /wizkids endpoint)

## Login

```bash
POST /auth/login
```

Body:

```json
{
  "email": "eva@company.com",
  "password": "password"
}
```

Response:

```json
{
  "accessToken": "..."
}
```

Use token in requests:

```bash
Authorization: Bearer <token>
```

---

## Roles & Permissions

### Guest (unauthenticated)

- Can view wizkids
- Email and phone number are hidden

### User (authenticated wizkid)

- Can view full wizkid data

### Boss (role: boss)

- Can delete wizkids
- Can fire / unfire wizkids

Business rules:

- A wizkid cannot fire themselves
- Fired wizkids cannot log in

---

## Wizkid Endpoints

## Create Wizkid

```bash
POST /wizkids
```

---

## List Wizkids

```bash
GET /wizkids
```

Guests receive public view.
Authenticated users receive full view.

---

## Filtering & Search

Filtering is done via query parameters.

## Text Search

Search by name or email:

```bash
GET /wizkids?search=eva
```

---

## Filter by Role

```bash
GET /wizkids?role=developer
```

Valid roles:

- boss
- developer
- designer
- intern

---

## Combined Filtering

```bash
GET /wizkids?search=eva&role=developer
```

All filters are optional and composable.

---

## Fire / Unfire

```bash
PATCH /wizkids/:id/fire
PATCH /wizkids/:id/unfire
```

- Only boss role allowed
- Email notification triggered (simulated)
- Fired users cannot log in

---

## Email System

Email sending is abstracted via:

- EmailService
- EmailTemplate enum
- Separate template rendering logic

Emails are currently simulated via logs. The system can be easily extended with real providers (SES, Sendgrid, etc.).

---

## Auto Delete Job

Wizkids fired for more than:

```bash
AUTO_DELETE_AFTER_DAYS
```

are automatically deleted.

Implemented using a scheduled cron job.
Deletion logic is separated from the scheduler for better testability.

---

## Architectural Notes

- DTO validation using class-validator
- Strict input whitelisting
- Domain logic inside services
- Controllers handle transport layer only
- Defensive ObjectId validation
- Proper HTTP status codes (400, 401, 403, 404, 409)
- Structured logging for important domain events

The goal was to prioritize clean architecture and scalability over minimal implementation.

---

## Possible Improvements

- Pagination on list endpoint
- Rate limiting on login
- HTML email templates
- Async job queue for email sending
- Global exception filter standardization

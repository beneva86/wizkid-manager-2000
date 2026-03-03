# Wizkid-manager-2000 app

Wizkid Manager 2000 is a backend-driven application built with NestJS and MongoDB, designed with scalability and clean architecture in mind.

The goal of the project is to manage “wizkids” (team members) through a well-structured REST API that supports authentication, role-based access control, and business-driven workflows such as firing and unfiring users.

The focus of this implementation is on backend quality, clarity, and extensibility rather than UI complexity.

## Prerequisites

- Node.js (>=18)
- pnpm
- Docker (for MongoDB)

## Run the application

1. Start MongoDB:

   docker compose up -d

2. Start backend:

   cd backend
   pnpm install
   pnpm start:dev

# Minimal Local + OAuth Authentication Project

This project serves to implement a **minimal authentication system** with both **Local** and **OAuth** strategies using the following tech stack:

- **Frontend**: Next.js (TypeScript)
- **Backend**: Express (TypeScript)
- **Database**: MongoDB (Mongoose ODM)
- **Monorepo Management**: Nx

## Features

- **Local Authentication**: Allows users to sign up, log in, and log out using an email and password.
- **OAuth Authentication**: Supports third-party authentication (e.g., Google, GitHub) using OAuth providers.
- **JWT Token-Based Authentication**: Uses JSON Web Tokens (JWT) to manage sessions and authorization.

## Stack

- **Express.js**: Backend framework to handle API requests and serve authentication logic.
- **Next.js**: Frontend framework with support for SSR (Server-Side Rendering) and API routes.
- **MongoDB**: NoSQL database to store user credentials and session information.
- **Mongoose**: ODM (Object Data Modeling) library to interact with MongoDB using schemas and models.
- **Nx**: Monorepo build system to manage both frontend and backend in a single repository.

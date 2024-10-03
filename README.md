# Minimal Local + OAuth Authentication Project

This project serves to implement a **minimal authentication system** with both **Local** and **OAuth** strategies using the following tech stack:

- **Frontend**: Next.js (TypeScript)
- **Backend**: Express (TypeScript)
- **Database**: MongoDB (Mongoose ODM)
- **Monorepo Management**: Nx

## Features

- **Local Authentication**: Allows users to sign up, log in, and log out using an email and password.
- **OAuth Authentication**: Supports third-party authentication (e.g., Google, GitHub) using OAuth providers.
- **Session-Based Authentication**: Uses express-sessions to manage sessions and authorization.

## Stack

- **Express.js**: Backend framework to handle API requests and serve authentication logic.
- **Next.js**: Frontend framework with support for SSR (Server-Side Rendering) and API routes.
- **MongoDB**: NoSQL database to store user credentials and session information.
- **Mongoose**: ODM (Object Data Modeling) library to interact with MongoDB using schemas and models.
- **Nx**: Monorepo build system to manage both frontend and backend in a single repository.

## Checkpoints

Checkpoint branches are available for intermediate steps of this project:

- **Checkpoint 1**:
  - Email-password authentication
  - No password reset
  - Users stored in memory
- **Checkpoint 2**:
  - Email-password authentication
  - Supports password reset
  - Users stored in memory
- **Checkpoint 3**:
  - Email-password authentication
  - Google/Facebook Oauth authentication
  - Supports password reset
  - Users stored in memory
- **Main Branch**:
  - Email-password authentication
  - Google/Facebook Oauth authentication
  - Supports password reset
  - Users stored in MongoDB database
  - Follows clean architecture principles

## How to run it

### 1. Setup Oauth Accounts and Nodemailer email

1. [Create credentials for Google Oauth](https://baserow.io/user-docs/configure-google-for-oauth-2-sso)

- Keep client id and client secret for later

2. [Create credentials for Facebook Oauth](https://baserow.io/user-docs/configure-facebook-for-oauth-2-sso)

- Keep client id and client secret for later

3. [Create app password from your project's email address](https://nodemailer.com/usage/using-gmail/)

- For reset password email source
- Keep email address and app password for later

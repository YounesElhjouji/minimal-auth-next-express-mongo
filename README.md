## Outline

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Checkpoints](#checkpoints)
4. [How to Run it](#how-to-run-it)

## Project Overview

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

- Keep app id and app secret for later

3. [Create app password from your project's email address](https://nodemailer.com/usage/using-gmail/)

- For reset password email source
- Keep email address and app password for later

### 2. Setup Environment Variables

#### For Backend:

In backend/.env

```
GOOGLE_CLIENT_ID={Your Google Client ID}
GOOGLE_CLIENT_SECRET={Your Google Client Secret}
FACEBOOK_APP_ID={Your Facebook App ID}
FACEBOOK_APP_SECRET={Your Facebook App Secret}
SESSION_SECRET_KEY={Randomly Generated Key base64 Key}
EMAIL_ADDRESS={Your Project Email Address}
EMAIL_PASSWORD={App Password for your Project Email Address}
MONGODB_URI={URI of your MongoDB Databade}
FRONTEND_URL={URL of the Frontend, default: "http://localhost:3000"}
PORT={Port of the backend, default to 3001}
```

#### For Frontend:

In frontend/.env.local

```
NEXT_PUBLIC_API_URL=http://localhost:3001 // Or your backend URL
```

### 3. Run Locally

Make sure you create a MongoDB Database and link it in your backend .env file

In project root directory run

```bash
yarn install
```

In two separate terminals run the following commands

```bash
nx serve backend
```

AND

```bash
nx start frontend
```

### 3. Run through Docker Compose

Ensure you have docker and docker-compose installed and then run

In the root directory, run:

```bash
docker-compose build
```

After your images are built, start the containers using

```bash
docker-compose up
```

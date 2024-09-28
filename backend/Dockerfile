# Use the official Node.js image as the base image
FROM node:18-alpine AS builder

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and yarn.lock files first to leverage Docker cache
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the app (TypeScript -> JavaScript)
RUN yarn nx build backend --skip-nx-cache

# Use a smaller Node.js image for the production environment
FROM node:18-alpine AS production

# Set the working directory in the production container
WORKDIR /app

# Copy only the production dependencies and compiled code from the builder
COPY --from=builder /app/dist/backend ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose the port the app runs on (optional)
EXPOSE 3001

# Start the application
CMD ["node", "dist/main.js"]

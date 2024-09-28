# Step 1: Use an official Node.js image as the base for building the app
FROM node:18-alpine AS builder

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy only the root package.json and yarn.lock (or package-lock.json)
COPY package.json yarn.lock ./

# Step 4: Install the dependencies (only installs shared dependencies)
RUN yarn install --frozen-lockfile

# Step 5: Copy the entire workspace into the container (everything, including both apps and shared dependencies)
COPY . .

# Step 6: Build the Next.js frontend app using Nx
RUN yarn nx build frontend --prod

# Step 7: Use a smaller Node.js image for the production environment
FROM node:18-alpine AS production

# Step 8: Set the working directory in the production container
WORKDIR /app

# Step 9: Copy the built Next.js frontend from the builder stage
COPY --from=builder /app/frontend/.next ./.next
COPY --from=builder /app/frontend/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/frontend/next.config.js ./next.config.js

# Step 10: Copy the shared node_modules from the builder stage
COPY --from=builder /app/node_modules ./node_modules

# Step 11: Expose the port that Next.js will run on
EXPOSE 3000

# Step 12: Start the application in production mode
CMD ["yarn", "next", "start"]

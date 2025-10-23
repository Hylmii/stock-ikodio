# Use the official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/web/package*.json ./apps/web/
COPY packages/*/package.json ./packages/*/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build --workspace=apps/web

EXPOSE 3000

# Start the application
CMD ["npm", "run", "start", "--workspace=apps/web"]
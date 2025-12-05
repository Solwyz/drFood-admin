# Build stage with Node.js 20
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY package-lock.json* ./

# Install ALL dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy nginx config FIRST
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from builder stage LAST (ensures fresh build)
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

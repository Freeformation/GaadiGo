# ==============================================================================
# Multi-Stage Dockerfile for VahaanRent Backend & Frontend
# ==============================================================================

# --- Stage 1: Build Backend ---
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ ./
RUN npm run build

# --- Stage 2: Build Frontend ---
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# --- Stage 3: Production Backend Runner ---
FROM node:20-alpine AS backend-prod
WORKDIR /app
ENV NODE_ENV=production
COPY backend/package*.json ./
RUN npm ci --only=production
COPY --from=backend-builder /app/backend/dist ./dist
RUN mkdir -p /app/uploads
EXPOSE 4000
CMD ["node", "dist/main.js"]

# --- Stage 4: Production Frontend (Nginx) ---
FROM nginx:alpine AS frontend-prod
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

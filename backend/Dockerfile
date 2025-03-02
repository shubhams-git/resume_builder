# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/templates ./src/templates
COPY --from=builder /app/prisma ./prisma

# Install minimal LaTeX dependencies
RUN apk add --no-cache texlive texlive-fonts-recommended

# Install production dependencies only
RUN npm prune --production

EXPOSE 3000
CMD ["node", "dist/server.js"]
# Use the official Bun image as base
FROM oven/bun:latest as build

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy all project files
COPY . .

# Build the application
RUN bun run build

# Production stage
FROM oven/bun:latest as production

WORKDIR /app

# Copy built assets from the build stage
COPY --from=build /app/build ./build
COPY --from=build /app/package.json ./

# Install only production dependencies
RUN bun install --frozen-lockfile --production

# Expose port 3002
EXPOSE 3002

# Set environment variables
ENV PORT=3002
ENV HOST=127.0.0.1

# Start the application
CMD ["bun", "./build/index.js"]

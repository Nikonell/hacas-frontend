# Use the official Bun image
FROM oven/bun:latest

# Set working directory
WORKDIR /app

# Copy package.json and lockfile
COPY package.json bun.lockb* ./

# Install production dependencies
RUN bun install --frozen-lockfile --production

# Copy pre-built application
COPY build ./build

# Expose port 3002
EXPOSE 3002

# Set environment variables
ENV PORT=3002
ENV HOST=127.0.0.1

# Start the application
CMD ["bun", "./build/index.js"]

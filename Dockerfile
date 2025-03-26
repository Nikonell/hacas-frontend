# Use the official Node.js image as base
FROM node:22-alpine

# Create app directory inside the container
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy app source
COPY . .

# Build the application
RUN npm run build

# Expose the port the app will run on
EXPOSE 3002

# Set the command to run the app
CMD ["node", "build/index.js"]

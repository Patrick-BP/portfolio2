# Use official Node.js runtime
FROM node:22-slim

# Create app directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy backend source code
COPY . .

# Expose port 5000
EXPOSE 5000

# Start the backend
CMD ["npm", "start"]

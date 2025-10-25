FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Expose port for React dev server
EXPOSE 3000

# Start React development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

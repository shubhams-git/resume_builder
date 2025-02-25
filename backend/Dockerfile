# Use Node.js 14 as the base image
FROM node:14

# Install LaTeX dependencies
RUN apt-get update && apt-get install -y texlive-latex-base texlive-latex-extra

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy application code
COPY . .

# Expose port 3000
EXPOSE 3000

# Command to start the application
CMD ["node", "app.js"]
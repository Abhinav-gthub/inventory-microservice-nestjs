# Use a lightweight Node.js image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy dependency files and install them
COPY package*.json ./
RUN npm install

# Copy the rest of your source code
COPY . .

# Build the NestJS application (generates the /dist folder)
RUN npm run build

# Start the production build
CMD ["npm", "run", "start:prod"]
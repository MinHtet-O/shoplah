# Backend Dockerfile
FROM node:18-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# Build the project
RUN npm run build

# Run the seed script using the npm script
RUN npm run seed:categories

# Production stage
FROM node:18-alpine

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package*.json ./

RUN npm ci

EXPOSE 8080

CMD ["npm", "run", "start"]

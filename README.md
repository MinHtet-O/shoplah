# Shoplah

## Features

- User authentication (login/register)
- Item upload for selling
- Item explorer for shopping
- Instant buy option
- Price negotiation (buyers can offer lower prices)
- Offer management (sellers can choose based on offers and accept the highest)
- Sales and purchase history tracking

## Preparation

Before proceeding with either Docker or local setup, clone the repository and navigate to the project directory:

```
git clone https://github.com/MinHtet-O/shoplah.git
cd shoplah
```

## Docker Setup

As a prerequisite, you need to install Docker and docker-compose. To set up the project using Docker, follow these steps from the project root directory:

1. Install dependencies:

   ```
   npm i
   ```

2. Build Docker containers:

   ```
   docker-compose build
   ```

3. Start the Docker containers:

   ```
   docker-compose up
   ```

4. Access the application at `http://localhost:3000`

## Local Setup

For a local setup, ensure you have PostgreSQL installed and running on `localhost:5432`. Then follow these steps:

1. From the project root directory, install all dependencies:

   ```
    npm run install:all
   ```

2. Seed the database with initial data. You have two options:

   Option A: Generate test data including categories, users,items and offers

   ```
   cd backend && npm run setup:dev && cd ..
   ```

   Option B: Seed only categories (start with clean data):

   ```
   cd backend && npm run seed:categories && cd ..
   ```

3. Start the development server:

   ```
   npm run dev
   ```

4. The application will be accessible at `http://localhost:5432`

## Testing

After setup, you can test the application by navigating to `http://localhost:3000` in your browser

## Technologies

Shoplah is built using the following technologies:

- Frontend:

  - React.js
  - Next.js
  - Bulma CSS

- Backend:

  - Node.js
  - Express.js
  - PostgreSQL

- DevOps:

  - Docker
  - Docker Compose

## TODO

The following items are planned for future development:

1. **Add test suites**

- Implement unit tests for components and functions
- Set up end-to-end tests to ensure full application functionality

2. Refactor codebase for improved maintainability and performance

3. Implement email verification for new user registrations

4. Setup to test environment and deployment with CI/CD

5. Develop a notification system for users (e.g., new offers, messages)

6. Add pagination to item listings and search results

7. Create user profile pages with customizable bios

8. S3 file upload

9. Develop and publish OpenAPI specification for the API

10. Feature flags

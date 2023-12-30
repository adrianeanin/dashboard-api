# Dashboard API

The dashboard api is a Node.js API that provides functionality for user registration, login, and link management. The API is designed with security and performance in mind, utilizing various middleware and libraries. It is built with NodeJs, Express, MySql and Sequelize with JWT auth and Yup for validation.

## Features

- User registration and login (Only admin can add a new user).
- Link management (CRUD operations).
- JWT Auth.
- Yup for validation.
- Rate limiting for enhanced security.
- Helmet middleware for HTTP header security.
- Sequelize ORM for database interaction.
- Error handling middleware for a robust API.
- Linting with ESLint

## Getting Started

### Prerequisites

- Node.js and yarn installed
- MySQL database

### Installation

1. Clone the repository:

```bash
   git clone https://github.com/adriananin/dashboard-api.git

```

2. Install dependencies:

```bash
cd dashboard-api
yarn install

```

3. Set up your MySQL database and update the `./utils/database.js` file with the appropriate connection details.
4. Create a `.env` file at the root of the project and add the necessary environment variables found in `./config/config.js` and `./utils/config.js`.
5. Run the admin seed script `yarn seed`.
6. Run the application `yarn dev` for dev mode or `yarn start` for production.

### Configuration

#### Database

To run db migration, run the migration script `yarn migrate`.

#### Rate Limiting

Rate limiting is configured using the express-rate-limit middleware. You can adjust the rate limit and window duration in the `./app.js` file.

#### Security

Security measures such as CORS, helmet, and disabling the 'x-powered-by' header are implemented in the `./app.js` file.

#### Testing

To run integration tests, run the test script `yarn test`.

#### Linting

To run the linter, run the lint script `yarn lint`.

### API Endpoints

#### Users

- POST /api/users/add: Register a new user (only and admin can add a new user).
- POST /api/users/login: Login with existing credentials.

#### Links

- GET /api/links: Get all links (all users).
- GET /api/links/:id: Get a specific link (all users).
- POST /api/links/create-link: Create a new link (admin only).
- PUT /api/links/:id: Update an existing link (admin only).
- DELETE /api/links/:id: Delete a link (admin only).

### Contributing

Feel free to contribute to the development of this API by opening issues or submitting pull requests.

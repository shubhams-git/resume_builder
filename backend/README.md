# Resume Builder Backend Service

A robust Node.js backend service for the Resume Builder application that handles resume generation with LaTeX support.

## 🚀 Technology Stack

- **Runtime Environment:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT with bcryptjs
- **Documentation Format:** LaTeX (using node-latex)
- **Validation:** Zod
- **Logging:** Winston
- **Security:** Helmet, Express Rate Limit
- **Environment Management:** dotenv, envalid

## 📁 Project Structure

```
backend/
├── src/
│   ├── app.js           # Express app configuration
│   ├── server.js        # Server initialization
│   ├── controllers/     # Request handlers
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   ├── services/       # Business logic
│   ├── models/         # Data models
│   ├── utils/          # Utility functions
│   ├── config/         # Configuration files
│   └── logs/          # Application logs
├── prisma/            # Database schema and migrations
├── logs/             # Server logs
└── Dockerfile        # Container configuration
```

## 🛠️ Setup and Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
- Copy `.env.example` to `.env`
- Configure the necessary environment variables:
  - Database connection
  - JWT secret
  - API keys
  - Other service configurations

4. **Database Setup**
```bash
npx prisma generate
npx prisma migrate dev
```

5. **Start the Server**
```bash
npm start
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Rate limiting for API endpoints
- Helmet for HTTP header security
- CORS protection
- Environment variable validation

## 📝 API Documentation

The API provides endpoints for:
- User authentication and management
- Resume creation and management
- LaTeX document generation
- File upload and storage

Detailed API documentation is available at `/api-docs` when running the server.

## 🔍 Logging

- Winston logger implementation
- Separate error and combined logs
- Log rotation and management
- Performance monitoring

## 🐳 Docker Support

Build the container:
```bash
docker build -t resume-builder-backend .
```

Run the container:
```bash
docker run -p 3000:3000 resume-builder-backend
```

## 🧪 Testing

```bash
npm test        # Run tests
npm run test:coverage  # Run tests with coverage report
```

## 📦 Dependencies

Key dependencies include:
- `express`: Web framework
- `@prisma/client`: Database ORM
- `node-latex`: LaTeX document generation
- `jsonwebtoken`: Authentication
- `winston`: Logging
- `zod`: Schema validation
- `helmet`: Security middleware
- `cors`: Cross-Origin Resource Sharing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

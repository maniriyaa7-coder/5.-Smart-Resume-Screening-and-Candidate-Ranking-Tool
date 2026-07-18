# RecruitAI Backend - Authentication API

Production-ready Node.js + Express + MongoDB authentication backend.

## Features

- ✅ JWT-based authentication (Access + Refresh tokens)
- ✅ Secure password hashing with bcrypt (12 rounds)
- ✅ Role-based access control (Recruiter/Candidate)
- ✅ Input validation with express-validator
- ✅ MongoDB with Mongoose ODM
- ✅ HTTP-only cookie support
- ✅ CORS enabled
- ✅ Comprehensive error handling
- ✅ Request logging

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Atlas)
- **ODM:** Mongoose
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **Validation:** express-validator
- **Environment:** dotenv

## Installation

```bash
npm install
```

## Configuration

Copy `.env.example` to `.env` and update:

```env
MONGODB_URI=your-mongodb-atlas-uri
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
```

## Running

Development:
```bash
npm run dev
```

Production:
```bash
npm start
```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/refresh` | Refresh access token | No |
| POST | `/api/auth/logout` | Logout user | Yes |
| GET | `/api/auth/me` | Get current user | Yes |
| GET | `/api/auth/verify` | Verify token | Yes |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |

## Project Structure

```
src/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   └── authController.js    # Authentication logic
├── middleware/
│   ├── auth.js              # JWT middleware
│   ├── validation.js        # Input validation
│   └── errorHandler.js      # Error handling
├── models/
│   └── User.js              # User model
├── routes/
│   └── authRoutes.js        # Auth routes
├── utils/
│   └── jwt.js               # JWT utilities
└── server.js                # App entry point
```

## Security

- Passwords hashed with bcrypt (12 salt rounds)
- JWT tokens with short expiry (15 min access, 7 day refresh)
- HTTP-only cookies for XSS protection
- Input validation and sanitization
- MongoDB injection protection
- CORS with credentials
- Secure headers ready

## MongoDB Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (recruiter/candidate),
  company: String (required for recruiters),
  refreshToken: String,
  isActive: Boolean,
  lastLogin: Date,
  timestamps: true
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development |
| MONGODB_URI | MongoDB connection string | required |
| JWT_SECRET | JWT secret key | required |
| JWT_EXPIRE | Access token expiry | 15m |
| JWT_REFRESH_SECRET | Refresh token secret | required |
| JWT_REFRESH_EXPIRE | Refresh token expiry | 7d |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:3000 |
| COOKIE_EXPIRE | Cookie expiry in days | 7 |

## Error Handling

All errors return JSON:
```json
{
  "success": false,
  "message": "Error message"
}
```

Common status codes:
- 400: Bad Request (validation errors)
- 401: Unauthorized (auth errors)
- 403: Forbidden (permission errors)
- 404: Not Found
- 500: Internal Server Error

## Development

The server includes:
- Automatic request logging
- MongoDB connection monitoring
- Graceful shutdown handling
- Hot reload with nodemon

## Production Deployment

1. Set `NODE_ENV=production`
2. Use strong JWT secrets
3. Update CORS to specific domain
4. Enable MongoDB Atlas IP whitelist
5. Use environment variables manager
6. Enable rate limiting (add middleware)
7. Add helmet for security headers
8. Enable compression
9. Use PM2 or similar for process management

## License

ISC

# QuickDesk Backend API

A robust Node.js backend API for the QuickDesk help desk solution, built with Express.js, PostgreSQL, and Prisma ORM.

## 🚀 Features

- **RESTful API** with comprehensive endpoints
- **JWT Authentication** with role-based access control
- **PostgreSQL Database** with Prisma ORM
- **File Upload** support with Multer
- **Email Notifications** using Nodemailer
- **Input Validation** with Joi
- **Rate Limiting** and security middleware
- **Comprehensive Error Handling**
- **Database Seeding** with sample data

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/me` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Tickets
- `POST /api/tickets` - Create new ticket
- `GET /api/tickets` - Get user's tickets (End User)
- `GET /api/tickets/all` - Get all tickets (Agent/Admin)
- `GET /api/tickets/:id` - Get specific ticket
- `PUT /api/tickets/:id/status` - Update ticket status
- `PUT /api/tickets/:id/assign` - Assign ticket to agent
- `POST /api/tickets/:id/comment` - Add comment to ticket
- `GET /api/tickets/stats/overview` - Get ticket statistics

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/:id` - Update category (Admin)
- `DELETE /api/categories/:id` - Delete category (Admin)
- `GET /api/categories/:id` - Get category by ID

### Users
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/:id` - Get user by ID (Admin)
- `PUT /api/users/:id/role` - Update user role (Admin)
- `GET /api/users/agents/list` - Get agents list
- `GET /api/users/stats/overview` - Get user statistics

## 🛠 Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **File Upload**: Multer
- **Email**: Nodemailer
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate Limiting

## 📦 Installation

### Prerequisites
- Node.js 18 or higher
- PostgreSQL 14 or higher
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate dev
   
   # Seed the database with sample data
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:5000`

## 🔧 Environment Variables

Create a `.env` file in the backend directory:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/quickdesk"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Server Configuration
PORT=5000
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
BASE_URL="http://localhost:5000"

# Email Configuration (SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH="./uploads"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📊 Database Schema

The application uses the following database schema:

### Users Table
- `id` (UUID, Primary Key)
- `name` (VARCHAR)
- `email` (VARCHAR, Unique)
- `passwordHash` (VARCHAR)
- `role` (ENUM: END_USER, AGENT, ADMIN)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

### Categories Table
- `id` (UUID, Primary Key)
- `name` (VARCHAR, Unique)
- `createdAt` (TIMESTAMP)

### Tickets Table
- `id` (UUID, Primary Key)
- `subject` (VARCHAR)
- `description` (TEXT)
- `status` (ENUM: OPEN, IN_PROGRESS, RESOLVED, CLOSED)
- `categoryId` (UUID, Foreign Key)
- `creatorId` (UUID, Foreign Key)
- `assignedToId` (UUID, Foreign Key)
- `attachmentUrl` (VARCHAR)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

### Comments Table
- `id` (UUID, Primary Key)
- `ticketId` (UUID, Foreign Key)
- `userId` (UUID, Foreign Key)
- `content` (TEXT)
- `createdAt` (TIMESTAMP)

## 🔐 Authentication & Authorization

### JWT Token Structure
```json
{
  "userId": "user-uuid",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Role-Based Access Control

#### End User
- Create and view own tickets
- Add comments to own tickets
- Update own profile

#### Agent
- View all tickets
- Update ticket status
- Assign tickets to self or other agents
- Add comments to any ticket
- View ticket statistics

#### Admin
- All agent permissions
- Manage user roles
- Manage categories
- View user statistics
- Full system access

## 📧 Email Notifications

The application sends email notifications for:

1. **Welcome Email** - When a user registers
2. **Ticket Confirmation** - When a ticket is created
3. **Status Updates** - When ticket status changes
4. **Assignment Notifications** - When tickets are assigned
5. **Comment Notifications** - When new comments are added

## 🗂 File Upload

The application supports file uploads with the following features:

- **Supported Formats**: Images, PDFs, Documents, Archives
- **File Size Limit**: 10MB (configurable)
- **Storage**: Local file system
- **Security**: File type validation and sanitization

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

## 📝 API Documentation

### Request/Response Format

All API responses follow this format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response Format

```json
{
  "success": false,
  "error": "Error message"
}
```

### Pagination

List endpoints support pagination:

```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

## 🚀 Deployment

### Using Docker

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

2. **Run database migrations**
   ```bash
   docker-compose exec backend npx prisma migrate deploy
   ```

3. **Seed the database**
   ```bash
   docker-compose exec backend npm run db:seed
   ```

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set production environment variables**

3. **Run database migrations**
   ```bash
   npx prisma migrate deploy
   ```

4. **Start the application**
   ```bash
   npm start
   ```

## 🔍 Health Check

The API provides a health check endpoint:

```bash
GET /health
```

Response:
```json
{
  "status": "OK",
  "timestamp": "2023-01-01T00:00:00.000Z",
  "environment": "production"
}
```

## 📋 Sample Data

The seeding script creates:

- **5 default categories**: Technical Support, Billing, Feature Request, Bug Report, General Inquiry
- **3 sample users**:
  - Admin: `admin@quickdesk.com` / `admin123`
  - Agent: `agent@quickdesk.com` / `agent123`
  - User: `user@example.com` / `user123`
- **3 sample tickets** with comments

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation 
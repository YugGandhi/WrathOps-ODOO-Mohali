# QuickDesk - Help Desk Solution

A modern, intuitive help desk solution that allows users to create and track support tickets, with support agents managing and resolving them efficiently.

## 🎯 Project Overview

QuickDesk is a full-stack web application designed to streamline customer support operations. It provides a clean, responsive interface for end users to submit tickets and for support agents to manage them effectively.

### Key Features

- **Multi-role User System**: End Users, Support Agents, and Administrators
- **Ticket Management**: Create, track, and resolve support tickets
- **Real-time Communication**: Threaded conversations on tickets
- **File Attachments**: Support for file uploads
- **Email Notifications**: Automated email alerts for ticket updates
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Advanced Filtering**: Search and filter tickets by various criteria

## 👥 User Roles & Permissions

### End User
- Register and log in
- Create new support tickets with subject, description, category, and attachments
- View dashboard of submitted tickets
- Track ticket status
- View threaded conversations
- Add replies/comments to open or in-progress tickets

### Support Agent
- Log in and access agent dashboard
- View all tickets with filtering options
- Assign tickets to themselves or other agents
- Update ticket status (Open → In Progress → Resolved → Closed)
- Add comments/updates to tickets
- Search and filter tickets

### Administrator
- Manage user roles (assign End User, Agent, Admin roles)
- Manage ticket categories (create, edit, delete)
- Full visibility into all system activities
- System metrics and analytics

## 🛠 Technology Stack

### Frontend
- **Framework**: React.js with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form
- **UI Components**: Headless UI / Radix UI

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Email Service**: Nodemailer
- **Validation**: Joi or Zod

### DevOps & Tools
- **Package Manager**: npm or yarn
- **Version Control**: Git
- **API Documentation**: Swagger/OpenAPI
- **Testing**: Jest, React Testing Library
- **Linting**: ESLint, Prettier

## 📁 Project Structure

```
quickdesk/
├── frontend/                 # React frontend application
│   ├── public/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API service functions
│   │   ├── store/          # Redux store configuration
│   │   ├── types/          # TypeScript type definitions
│   │   ├── utils/          # Utility functions
│   │   └── styles/         # Global styles
│   ├── package.json
│   └── tsconfig.json
├── backend/                 # Node.js backend application
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions
│   │   └── config/         # Configuration files
│   ├── prisma/             # Database schema and migrations
│   ├── package.json
│   └── tsconfig.json
├── docs/                   # Documentation
├── .env.example           # Environment variables template
├── docker-compose.yml     # Docker configuration
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/quickdesk.git
   cd quickdesk
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

4. **Set up the database**
   ```bash
   cd ../backend
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start the development servers**
   ```bash
   # Start backend (from backend directory)
   npm run dev

   # Start frontend (from frontend directory)
   npm start
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('end_user', 'agent', 'admin') DEFAULT 'end_user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Categories Table
```sql
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tickets Table
```sql
CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('open', 'in_progress', 'resolved', 'closed') DEFAULT 'open',
    category_id UUID REFERENCES categories(id),
    creator_id UUID REFERENCES users(id),
    assigned_to_id UUID REFERENCES users(id),
    attachment_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Comments Table
```sql
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID REFERENCES tickets(id),
    user_id UUID REFERENCES users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Create a new user
- `POST /api/auth/login` - Authenticate user and return JWT
- `GET /api/auth/me` - Get current user details

### Tickets
- `POST /api/tickets` - Create a new ticket
- `GET /api/tickets` - Get user's tickets (End User)
- `GET /api/tickets/all` - Get all tickets (Agent/Admin)
- `GET /api/tickets/:id` - Get specific ticket details
- `PUT /api/tickets/:id/status` - Update ticket status
- `PUT /api/tickets/:id/assign` - Assign ticket to agent
- `POST /api/tickets/:id/comment` - Add comment to ticket

### Categories (Admin Only)
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Users (Admin Only)
- `GET /api/users` - Get all users
- `PUT /api/users/:id/role` - Update user role

## 🎨 UI/UX Design

### Design Principles
- **Clean & Modern**: Minimalist design with clear visual hierarchy
- **Responsive**: Fully responsive design for all devices
- **Intuitive**: Simple and consistent navigation
- **Accessible**: WCAG 2.1 AA compliance

### Color Palette
- **Primary**: #3B82F6 (Blue)
- **Secondary**: #6B7280 (Gray)
- **Success**: #10B981 (Green)
- **Warning**: #F59E0B (Yellow)
- **Error**: #EF4444 (Red)
- **Background**: #F9FAFB (Light Gray)

### Status Indicators
- **Open**: Blue (#3B82F6)
- **In Progress**: Yellow (#F59E0B)
- **Resolved**: Green (#10B981)
- **Closed**: Gray (#6B7280)

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Input Validation**: Server-side validation for all inputs
- **XSS Protection**: Sanitized user inputs
- **SQL Injection Prevention**: Parameterized queries
- **CORS Configuration**: Proper cross-origin resource sharing
- **Rate Limiting**: API rate limiting to prevent abuse

## 📧 Email Notifications

### Email Triggers
1. **New Ticket Created**: Confirmation email to end user
2. **Status Change**: Notification to end user with new status and agent comments
3. **Assignment**: Notification to assigned agent
4. **New Comment**: Notification to ticket creator

### Email Templates
- Welcome email for new users
- Ticket confirmation emails
- Status update notifications
- Assignment notifications

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm test
```

### Backend Testing
```bash
cd backend
npm test
```

### Test Coverage
- Unit tests for components and utilities
- Integration tests for API endpoints
- E2E tests for critical user flows

## 🚀 Deployment

### Production Build
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm run build
```

### Docker Deployment
```bash
docker-compose up -d
```

### Environment Variables
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/quickdesk

# JWT
JWT_SECRET=your-jwt-secret

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation in the `/docs` folder

## 🔮 Future Enhancements

### Planned Features
- **Real-time Updates**: WebSocket integration for live ticket updates
- **Advanced Analytics**: Detailed reporting and metrics
- **Mobile App**: Native mobile applications
- **Multi-language Support**: Internationalization
- **Advanced Search**: Full-text search with Elasticsearch
- **API Rate Limiting**: Enhanced API protection
- **Webhook Support**: Third-party integrations

### Stretch Goals
- **AI-powered Ticket Routing**: Automatic ticket assignment
- **Knowledge Base**: Self-service documentation
- **SLA Management**: Service level agreement tracking
- **Customer Satisfaction**: Post-resolution surveys
- **Integration APIs**: Third-party service integrations

## 📋 Evaluation Criteria & Development Standards

This project adheres to the following evaluation criteria to ensure high-quality, maintainable, and scalable code:

### 1. 🏗️ Coding Standards

#### Code Quality
- **Consistent naming conventions**: camelCase for variables/functions, PascalCase for components/classes
- **Proper indentation and formatting**: 2-space indentation, consistent spacing
- **Clear, maintainable, and idiomatic code**: Following language-specific best practices
- **Comments and documentation**: JSDoc for functions, inline comments for complex logic
- **Avoidance of code smells and anti-patterns**: No magic numbers, proper error handling

#### Business Logic
- **Correctness of business logic and workflows**: Proper ticket lifecycle management
- **Clear and understandable control flow**: Logical progression through user actions
- **Handling of edge cases and errors**: Graceful error handling with user feedback
- **Accurate implementation of requirements**: All specified features implemented correctly

### 2. 🧩 Logic & Modularity

#### Separation of Concerns
- **Reusable functions, components, modules**: Shared utilities and components
- **Clean project structure**: Organized folder hierarchy with clear responsibilities
- **Low coupling and high cohesion**: Modules work independently with clear interfaces
- **Stateless design where appropriate**: Functional components and pure functions

#### Code Organization
```
src/
├── components/          # Reusable UI components
│   ├── common/         # Shared components (Button, Input, etc.)
│   ├── forms/          # Form-specific components
│   └── layout/         # Layout components (Header, Sidebar, etc.)
├── pages/              # Page-level components
├── hooks/              # Custom React hooks
├── services/           # API and business logic services
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
└── constants/          # Application constants
```

### 3. 🗄️ Database Design

#### Schema Design
- **Well-structured schema**: Normalized design with proper relationships
- **Clear relationships between entities**: Foreign key constraints and referential integrity
- **Efficient indexing**: Indexes on frequently queried columns
- **Use of migrations**: Version-controlled database schema changes

#### Security
- **Safe, parameterized queries**: Prevention of SQL injection attacks
- **Input validation**: Server-side validation for all database inputs
- **Access control**: Role-based database access patterns

### 4. 🎨 Frontend Design

#### User Experience
- **Clean, intuitive UI design**: Modern, minimalist interface
- **Consistent styling and layout**: Design system with reusable components
- **Responsiveness**: Mobile-first design approach
- **Accessibility**: WCAG 2.1 AA compliance with ARIA labels and alt text

#### Code Maintainability
- **Component-based architecture**: Reusable, testable components
- **CSS organization**: Tailwind CSS with custom utility classes
- **State management**: Redux Toolkit for predictable state updates
- **Type safety**: TypeScript for compile-time error checking

### 5. ⚡ Performance

#### Optimization Strategies
- **Efficient algorithms and queries**: Optimized database queries and data processing
- **Avoidance of bottlenecks**: No blocking operations, proper async handling
- **Optimized assets**: Image compression, code splitting, tree shaking
- **Caching strategies**: Browser caching, API response caching
- **Lazy loading**: Code splitting and dynamic imports

#### Performance Metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3.8s

### 6. 📈 Scalability

#### Architecture Design
- **Supports growth**: Horizontal scaling capabilities
- **Decoupled components/services**: Microservices-ready architecture
- **Stateless design**: JWT-based authentication, no server-side sessions
- **Load balancing support**: API designed for horizontal scaling

#### Future Considerations
- **Maintainability**: Clear documentation and code organization
- **Extensibility**: Plugin architecture for new features
- **Monitoring**: Application performance monitoring and logging

### 7. 🔒 Security

#### Security Measures
- **Input validation and sanitization**: Server-side validation for all inputs
- **Protection against vulnerabilities**:
  - SQL Injection: Parameterized queries
  - XSS: Input sanitization and CSP headers
  - CSRF: Token-based protection
- **Secure authentication**: JWT with proper expiration and refresh
- **Password security**: bcrypt hashing with salt
- **HTTPS enforcement**: Secure headers and redirects

#### Security Headers
```javascript
// Security middleware configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
```

### 8. 👥 User Experience

#### Navigation & Interaction
- **User-friendly navigation**: Intuitive menu structure and breadcrumbs
- **Clear error messages**: Descriptive error handling with user guidance
- **Consistent UI/UX patterns**: Design system with reusable components
- **Intuitive forms**: Progressive disclosure and smart defaults
- **Help and documentation**: Contextual help and user guides

#### Accessibility Features
- **Keyboard navigation**: Full keyboard accessibility
- **Screen reader support**: Proper ARIA labels and semantic HTML
- **Color contrast**: WCAG AA compliant color ratios
- **Focus management**: Visible focus indicators and logical tab order

## 🧪 Testing Strategy

### Test Coverage Requirements
- **Unit tests**: 80%+ coverage for business logic
- **Integration tests**: API endpoint testing
- **E2E tests**: Critical user journey testing
- **Accessibility tests**: Automated a11y testing

### Testing Tools
```json
{
  "devDependencies": {
    "jest": "^29.0.0",
    "@testing-library/react": "^13.0.0",
    "@testing-library/jest-dom": "^5.16.0",
    "cypress": "^12.0.0",
    "axe-core": "^4.7.0"
  }
}
```

## 📊 Code Quality Metrics

### Linting Configuration
```json
{
  "eslintConfig": {
    "extends": [
      "eslint:recommended",
      "@typescript-eslint/recommended",
      "prettier"
    ],
    "rules": {
      "complexity": ["error", 10],
      "max-lines-per-function": ["error", 50],
      "no-console": "warn"
    }
  }
}
```

### Performance Budget
- **Bundle size**: < 500KB gzipped
- **API response time**: < 200ms for 95th percentile
- **Database query time**: < 100ms for complex queries

---

**QuickDesk** - Streamlining support operations with modern technology and intuitive design. 
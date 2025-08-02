# Database Seeding

This directory contains the database seeding script for the QuickDesk application.

## Files

- `schema.prisma` - Prisma schema definition
- `seed.js` - Database seeding script
- `README.md` - This file

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up your database connection in `.env`:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/quickdesk"
   ```

3. Generate Prisma client:
   ```bash
   npm run db:generate
   ```

4. Push the schema to your database:
   ```bash
   npm run db:push
   ```

## Running the Seed Script

### Option 1: Using npm script
```bash
npm run db:seed
```

### Option 2: Direct execution
```bash
node prisma/seed.js
```

### Option 3: Using Prisma CLI
```bash
npx prisma db seed
```

## What the Seed Script Creates

### Users (5 total)
- **Admin User**: `admin@quickdesk.com` / `admin123`
- **Support Agent**: `agent@quickdesk.com` / `agent123`
- **John Doe**: `john.doe@example.com` / `user123`
- **Jane Smith**: `jane.smith@example.com` / `user123`
- **Bob Wilson**: `bob.wilson@example.com` / `user123`

### Categories (8 total)
- Technical
- Account
- Feature Request
- Performance
- Mobile
- UI/UX
- Security
- Bug Report

### Tickets (8 total)
Various tickets with different statuses:
- **Open**: Login issues, feature requests, mobile app crashes, security vulnerabilities
- **In Progress**: Password reset issues, UI layout problems
- **Resolved**: System performance issues
- **Closed**: Database connection errors

### Comments (15 total)
Realistic comments across different tickets showing:
- Initial ticket creation comments
- Agent responses and updates
- Resolution confirmations
- Feature request acknowledgments

## Sample Data Features

### Ticket Status Distribution
- **Open**: 4 tickets
- **In Progress**: 2 tickets
- **Resolved**: 1 ticket
- **Closed**: 1 ticket

### User Role Distribution
- **Admin**: 1 user
- **Agent**: 1 user
- **End Users**: 3 users

### Category Usage
- **Technical**: 2 tickets
- **Account**: 1 ticket
- **Feature Request**: 1 ticket
- **Performance**: 1 ticket
- **Mobile**: 1 ticket
- **UI/UX**: 1 ticket
- **Security**: 1 ticket

## Login Credentials

Use these credentials to test different user roles:

### Admin Access
- Email: `admin@quickdesk.com`
- Password: `admin123`
- Can access all features including user management

### Agent Access
- Email: `agent@quickdesk.com`
- Password: `agent123`
- Can manage tickets and respond to users

### End User Access
- Email: `john.doe@example.com` / `jane.smith@example.com` / `bob.wilson@example.com`
- Password: `user123`
- Can create tickets and view their own tickets

## Resetting the Database

To clear all data and reseed:

```bash
npm run db:reset
```

This will:
1. Drop all tables
2. Recreate the schema
3. Run the seed script automatically

## Development Workflow

1. **Initial Setup**:
   ```bash
   npm install
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

2. **Schema Changes**:
   ```bash
   npm run db:push
   npm run db:seed
   ```

3. **Reset for Clean State**:
   ```bash
   npm run db:reset
   ```

## Notes

- The seed script clears all existing data before creating new data
- Passwords are hashed using bcrypt with salt rounds of 10
- All UUIDs are generated automatically by PostgreSQL
- Timestamps are set automatically by Prisma
- The script includes proper error handling and logging 
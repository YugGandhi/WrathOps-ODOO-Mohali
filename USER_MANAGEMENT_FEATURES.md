# User Management Features

## Overview
The admin module now includes comprehensive user management capabilities allowing administrators to change user roles and ban/unban users.

## Features

### 1. User Role Management
- **Change User Roles**: Admins can change user roles between:
  - `END_USER` - Regular users who can create tickets
  - `AGENT` - Support agents who can handle tickets
  - `ADMIN` - Administrators with full system access

### 2. User Status Management
- **Ban/Unban Users**: Admins can ban users to prevent them from accessing the system
- **User Statuses**:
  - `ACTIVE` - Normal user access
  - `BANNED` - Blocked from accessing the system

## Database Changes

### New User Status Field
- Added `status` field to the `users` table
- Default value: `ACTIVE`
- Valid values: `ACTIVE`, `BANNED`

### Migration
Run the migration script to add the status field to existing users:
```bash
cd backend
node scripts/migrate-user-status.js
```

## API Endpoints

### Update User Role
```
PUT /api/users/:id/role
Authorization: Bearer <admin_token>
Body: { "role": "AGENT" }
```

### Update User Status
```
PUT /api/users/:id/status
Authorization: Bearer <admin_token>
Body: { "status": "BANNED" }
```

## Security Features

### Authentication Checks
- Banned users cannot log in
- Banned users cannot access any API endpoints
- Admins cannot change their own role or status

### Authorization
- Only admins can access user management features
- Role and status changes require admin privileges

## Frontend Features

### Admin Users Page
- View all users with their roles and status
- Edit user roles inline
- Ban/unban users with confirmation
- Visual indicators for user status (green for active, red for banned)
- Statistics showing user distribution by role

### User Interface
- Status badges with color coding
- Inline editing for both role and status
- Confirmation buttons for changes
- Clear visual feedback for actions

## Usage

### Changing User Roles
1. Navigate to Admin → Users
2. Click "Edit Role" for the desired user
3. Select new role from dropdown
4. Click the checkmark to save or X to cancel

### Banning Users
1. Navigate to Admin → Users
2. Click "Ban" button next to the user
3. Select "Banned" from the status dropdown
4. Click the checkmark to confirm

### Unbanning Users
1. Navigate to Admin → Users
2. Click "Unban" button next to the banned user
3. Select "Active" from the status dropdown
4. Click the checkmark to confirm

## Error Handling
- Validation ensures only valid roles and statuses are accepted
- Proper error messages for unauthorized actions
- Protection against self-modification by admins
- Database constraints prevent invalid status values 
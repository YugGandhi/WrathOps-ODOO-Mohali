-- Add status column to users table
ALTER TABLE users ADD COLUMN status VARCHAR(10) DEFAULT 'ACTIVE' NOT NULL;

-- Update all existing users to have ACTIVE status
UPDATE users SET status = 'ACTIVE' WHERE status IS NULL;

-- Add constraint to ensure status is either ACTIVE or BANNED
ALTER TABLE users ADD CONSTRAINT check_user_status CHECK (status IN ('ACTIVE', 'BANNED')); 
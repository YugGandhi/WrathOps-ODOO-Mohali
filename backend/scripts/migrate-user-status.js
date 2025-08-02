const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function migrateUserStatus() {
  try {
    console.log('Starting user status migration...');
    
    // Check if status column already exists
    const tableInfo = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'status'
    `;
    
    if (tableInfo.length > 0) {
      console.log('Status column already exists, skipping migration.');
    } else {
      // Add status column
      await prisma.$executeRawUnsafe(`
        ALTER TABLE users ADD COLUMN status VARCHAR(10) DEFAULT 'ACTIVE' NOT NULL
      `);
      console.log('Added status column to users table');
      
      // Update existing users to have ACTIVE status
      await prisma.$executeRawUnsafe(`
        UPDATE users SET status = 'ACTIVE' WHERE status IS NULL
      `);
      console.log('Updated existing users to ACTIVE status');
      
      // Add constraint
      await prisma.$executeRawUnsafe(`
        ALTER TABLE users ADD CONSTRAINT check_user_status CHECK (status IN ('ACTIVE', 'BANNED'))
      `);
      console.log('Added status constraint');
    }
    
    console.log('User status migration completed successfully!');
    
    // Verify the migration
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        status: true
      }
    });
    
    console.log(`Found ${users.length} users with status:`);
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}): ${user.status}`);
    });
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateUserStatus(); 
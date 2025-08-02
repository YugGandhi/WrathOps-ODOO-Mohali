const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function migrateCategoryStatus() {
  try {
    console.log('Starting category status migration...');
    
    // Check if status column already exists
    const tableInfo = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'categories' AND column_name = 'status'
    `;
    
    if (tableInfo.length > 0) {
      console.log('Status column already exists, skipping migration.');
    } else {
      // Add status column
      await prisma.$executeRawUnsafe(`
        ALTER TABLE categories ADD COLUMN status VARCHAR(10) DEFAULT 'ACTIVE' NOT NULL
      `);
      console.log('Added status column to categories table');
      
      // Add description column if it doesn't exist
      const descTableInfo = await prisma.$queryRaw`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'categories' AND column_name = 'description'
      `;
      
      if (descTableInfo.length === 0) {
        await prisma.$executeRawUnsafe(`
          ALTER TABLE categories ADD COLUMN description TEXT
        `);
        console.log('Added description column to categories table');
      }
      
      // Add updated_at column if it doesn't exist
      const updatedAtTableInfo = await prisma.$queryRaw`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'categories' AND column_name = 'updated_at'
      `;
      
      if (updatedAtTableInfo.length === 0) {
        await prisma.$executeRawUnsafe(`
          ALTER TABLE categories ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        `);
        console.log('Added updated_at column to categories table');
      }
      
      // Update existing categories to have ACTIVE status
      await prisma.$executeRawUnsafe(`
        UPDATE categories SET status = 'ACTIVE' WHERE status IS NULL
      `);
      console.log('Updated existing categories to ACTIVE status');
      
      // Add constraint
      await prisma.$executeRawUnsafe(`
        ALTER TABLE categories ADD CONSTRAINT check_category_status CHECK (status IN ('ACTIVE', 'INACTIVE'))
      `);
      console.log('Added status constraint');
    }
    
    console.log('Category status migration completed successfully!');
    
    // Verify the migration
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        status: true
      }
    });
    
    console.log(`Found ${categories.length} categories with status:`);
    categories.forEach(category => {
      console.log(`- ${category.name}: ${category.status}`);
    });
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateCategoryStatus(); 
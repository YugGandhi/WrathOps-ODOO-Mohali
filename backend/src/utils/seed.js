const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');

    // Create default categories
    const categories = [
      { name: 'Technical Support' },
      { name: 'Billing' },
      { name: 'Feature Request' },
      { name: 'Bug Report' },
      { name: 'General Inquiry' }
    ];

    console.log('📝 Creating categories...');
    for (const category of categories) {
      await prisma.category.upsert({
        where: { name: category.name },
        update: {},
        create: category
      });
    }

    // Create admin user
    console.log('👤 Creating admin user...');
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await prisma.user.upsert({
      where: { email: 'admin@quickdesk.com' },
      update: {},
      create: {
        name: 'Admin User',
        email: 'admin@quickdesk.com',
        passwordHash: adminPassword,
        role: 'ADMIN'
      }
    });

    // Create agent user
    console.log('👨‍💼 Creating agent user...');
    const agentPassword = await bcrypt.hash('agent123', 12);
    const agent = await prisma.user.upsert({
      where: { email: 'agent@quickdesk.com' },
      update: {},
      create: {
        name: 'Support Agent',
        email: 'agent@quickdesk.com',
        passwordHash: agentPassword,
        role: 'AGENT'
      }
    });

    // Create sample end user
    console.log('👤 Creating sample end user...');
    const userPassword = await bcrypt.hash('user123', 12);
    const user = await prisma.user.upsert({
      where: { email: 'user@example.com' },
      update: {},
      create: {
        name: 'John Doe',
        email: 'user@example.com',
        passwordHash: userPassword,
        role: 'END_USER'
      }
    });

    // Get categories for sample tickets
    const technicalCategory = await prisma.category.findUnique({
      where: { name: 'Technical Support' }
    });

    const billingCategory = await prisma.category.findUnique({
      where: { name: 'Billing' }
    });

    // Create sample tickets
    console.log('🎫 Creating sample tickets...');
    
    const ticket1 = await prisma.ticket.create({
      data: {
        subject: 'Cannot access my account',
        description: 'I am unable to log into my account. I keep getting an error message saying "Invalid credentials" even though I am sure my password is correct.',
        status: 'OPEN',
        categoryId: technicalCategory.id,
        creatorId: user.id
      }
    });

    const ticket2 = await prisma.ticket.create({
      data: {
        subject: 'Billing question about monthly subscription',
        description: 'I have a question about my monthly subscription. I was charged twice this month and I would like to understand why.',
        status: 'IN_PROGRESS',
        categoryId: billingCategory.id,
        creatorId: user.id,
        assignedToId: agent.id
      }
    });

    const ticket3 = await prisma.ticket.create({
      data: {
        subject: 'Feature request: Dark mode',
        description: 'I would love to see a dark mode option in the application. This would be very helpful for users who work in low-light environments.',
        status: 'OPEN',
        categoryId: technicalCategory.id,
        creatorId: user.id
      }
    });

    // Create sample comments
    console.log('💬 Creating sample comments...');
    
    await prisma.comment.create({
      data: {
        content: 'Thank you for reporting this issue. I have assigned this ticket to our technical team for investigation.',
        ticketId: ticket1.id,
        userId: agent.id
      }
    });

    await prisma.comment.create({
      data: {
        content: 'I have reviewed your billing statement and I can see the duplicate charge. I will process a refund for the second charge.',
        ticketId: ticket2.id,
        userId: agent.id
      }
    });

    await prisma.comment.create({
      data: {
        content: 'Thank you for the feedback! We are currently working on implementing dark mode and it should be available in the next update.',
        ticketId: ticket3.id,
        userId: agent.id
      }
    });

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📋 Sample Data Created:');
    console.log('- 5 categories');
    console.log('- 1 admin user (admin@quickdesk.com / admin123)');
    console.log('- 1 agent user (agent@quickdesk.com / agent123)');
    console.log('- 1 end user (user@example.com / user123)');
    console.log('- 3 sample tickets with comments');
    
    console.log('\n🔑 Default Login Credentials:');
    console.log('Admin: admin@quickdesk.com / admin123');
    console.log('Agent: agent@quickdesk.com / agent123');
    console.log('User: user@example.com / user123');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seed();
}

module.exports = { seed }; 
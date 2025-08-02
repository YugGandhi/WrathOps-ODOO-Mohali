const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  console.log('🧹 Clearing existing data...');
  await prisma.comment.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  console.log('👥 Creating users...');
  
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@quickdesk.com',
      passwordHash: await bcrypt.hash('admin123', 10),
      role: 'ADMIN',
    },
  });

  const agentUser = await prisma.user.create({
    data: {
      name: 'Support Agent',
      email: 'agent@quickdesk.com',
      passwordHash: await bcrypt.hash('agent123', 10),
      role: 'AGENT',
    },
  });

  const endUser1 = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      passwordHash: await bcrypt.hash('user123', 10),
      role: 'END_USER',
    },
  });

  const endUser2 = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      passwordHash: await bcrypt.hash('user123', 10),
      role: 'END_USER',
    },
  });

  const endUser3 = await prisma.user.create({
    data: {
      name: 'Bob Wilson',
      email: 'bob.wilson@example.com',
      passwordHash: await bcrypt.hash('user123', 10),
      role: 'END_USER',
    },
  });

  console.log('✅ Users created:', { adminUser, agentUser, endUser1, endUser2, endUser3 });

  // Create categories
  console.log('📂 Creating categories...');
  
  const technicalCategory = await prisma.category.create({
    data: {
      name: 'Technical',
    },
  });

  const accountCategory = await prisma.category.create({
    data: {
      name: 'Account',
    },
  });

  const featureRequestCategory = await prisma.category.create({
    data: {
      name: 'Feature Request',
    },
  });

  const performanceCategory = await prisma.category.create({
    data: {
      name: 'Performance',
    },
  });

  const mobileCategory = await prisma.category.create({
    data: {
      name: 'Mobile',
    },
  });

  const uiuxCategory = await prisma.category.create({
    data: {
      name: 'UI/UX',
    },
  });

  const securityCategory = await prisma.category.create({
    data: {
      name: 'Security',
    },
  });

  const bugReportCategory = await prisma.category.create({
    data: {
      name: 'Bug Report',
    },
  });

  console.log('✅ Categories created');

  // Create tickets
  console.log('🎫 Creating tickets...');
  
  const ticket1 = await prisma.ticket.create({
    data: {
      subject: 'Login issue with new system',
      description: 'I cannot log into the new system. Getting an error message when trying to access the portal. The error says "Invalid credentials" but I\'m sure I\'m using the correct password.',
      status: 'OPEN',
      priority: 'HIGH',
      categoryId: technicalCategory.id,
      creatorId: endUser1.id,
      assignedToId: null,
    },
  });

  const ticket2 = await prisma.ticket.create({
    data: {
      subject: 'Password reset not working',
      description: 'The password reset functionality is not sending emails. I\'ve tried multiple times but never receive the reset email. This is urgent as I need to access my account.',
      status: 'IN_PROGRESS',
      priority: 'URGENT',
      categoryId: accountCategory.id,
      creatorId: endUser2.id,
      assignedToId: agentUser.id,
    },
  });

  const ticket3 = await prisma.ticket.create({
    data: {
      subject: 'Feature request: Dark mode',
      description: 'Would be great to have a dark mode option for the interface. Many users prefer dark themes, especially when working in low-light environments. This would improve user experience significantly.',
      status: 'OPEN',
      priority: 'LOW',
      categoryId: featureRequestCategory.id,
      creatorId: endUser3.id,
      assignedToId: null,
    },
  });

  const ticket4 = await prisma.ticket.create({
    data: {
      subject: 'System performance issues',
      description: 'The system is running very slowly during peak hours. Pages take 10-15 seconds to load, and sometimes timeout completely. This is affecting productivity.',
      status: 'RESOLVED',
      priority: 'HIGH',
      categoryId: performanceCategory.id,
      creatorId: endUser1.id,
      assignedToId: agentUser.id,
    },
  });

  const ticket5 = await prisma.ticket.create({
    data: {
      subject: 'Mobile app crashes',
      description: 'The mobile app crashes when trying to upload images. This happens consistently on both iOS and Android devices. The app freezes and then closes automatically.',
      status: 'OPEN',
      priority: 'HIGH',
      categoryId: mobileCategory.id,
      creatorId: endUser2.id,
      assignedToId: null,
    },
  });

  const ticket6 = await prisma.ticket.create({
    data: {
      subject: 'UI layout broken on mobile',
      description: 'The user interface layout is broken on mobile devices. Elements are overlapping and the navigation menu is not responsive. This makes the app unusable on phones.',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      categoryId: uiuxCategory.id,
      creatorId: endUser3.id,
      assignedToId: agentUser.id,
    },
  });

  const ticket7 = await prisma.ticket.create({
    data: {
      subject: 'Security vulnerability found',
      description: 'I noticed that sensitive data is being logged in plain text in the application logs. This could be a security risk and should be addressed immediately.',
      status: 'OPEN',
      priority: 'URGENT',
      categoryId: securityCategory.id,
      creatorId: endUser1.id,
      assignedToId: null,
    },
  });

  const ticket8 = await prisma.ticket.create({
    data: {
      subject: 'Database connection errors',
      description: 'Users are experiencing frequent database connection errors. The error message shows "Connection timeout" and this is happening multiple times per day.',
      status: 'CLOSED',
      priority: 'HIGH',
      categoryId: technicalCategory.id,
      creatorId: endUser2.id,
      assignedToId: agentUser.id,
    },
  });

  console.log('✅ Tickets created');

  // Create comments
  console.log('💬 Creating comments...');
  
  // Comments for ticket 1
  await prisma.comment.create({
    data: {
      ticketId: ticket1.id,
      userId: endUser1.id,
      content: 'Ticket created - I\'m unable to log in with my credentials.',
    },
  });

  await prisma.comment.create({
    data: {
      ticketId: ticket1.id,
      userId: agentUser.id,
      content: 'I\'ll investigate this login issue. Can you please try clearing your browser cache and cookies?',
    },
  });

  // Comments for ticket 2
  await prisma.comment.create({
    data: {
      ticketId: ticket2.id,
      userId: endUser2.id,
      content: 'Ticket created - Password reset emails not being received.',
    },
  });

  await prisma.comment.create({
    data: {
      ticketId: ticket2.id,
      userId: agentUser.id,
      content: 'I\'m working on this issue. The email service seems to be having problems. I\'ll update you soon.',
    },
  });

  await prisma.comment.create({
    data: {
      ticketId: ticket2.id,
      userId: agentUser.id,
      content: 'Update: Email service has been restored. Please try the password reset again.',
    },
  });

  // Comments for ticket 3
  await prisma.comment.create({
    data: {
      ticketId: ticket3.id,
      userId: endUser3.id,
      content: 'Ticket created - Requesting dark mode feature.',
    },
  });

  await prisma.comment.create({
    data: {
      ticketId: ticket3.id,
      userId: adminUser.id,
      content: 'This is a great suggestion! I\'ll add this to our roadmap for the next release.',
    },
  });

  // Comments for ticket 4
  await prisma.comment.create({
    data: {
      ticketId: ticket4.id,
      userId: endUser1.id,
      content: 'Ticket created - System is very slow during peak hours.',
    },
  });

  await prisma.comment.create({
    data: {
      ticketId: ticket4.id,
      userId: agentUser.id,
      content: 'I\'ve identified the performance bottleneck. It\'s related to database queries. Working on optimization.',
    },
  });

  await prisma.comment.create({
    data: {
      ticketId: ticket4.id,
      userId: agentUser.id,
      content: 'Performance optimization completed. The system should now be much faster. Please test and let me know if you still experience issues.',
    },
  });

  // Comments for ticket 5
  await prisma.comment.create({
    data: {
      ticketId: ticket5.id,
      userId: endUser2.id,
      content: 'Ticket created - Mobile app crashes when uploading images.',
    },
  });

  // Comments for ticket 6
  await prisma.comment.create({
    data: {
      ticketId: ticket6.id,
      userId: endUser3.id,
      content: 'Ticket created - UI layout broken on mobile devices.',
    },
  });

  await prisma.comment.create({
    data: {
      ticketId: ticket6.id,
      userId: agentUser.id,
      content: 'I\'m investigating the mobile layout issues. This appears to be a CSS responsive design problem.',
    },
  });

  // Comments for ticket 7
  await prisma.comment.create({
    data: {
      ticketId: ticket7.id,
      userId: endUser1.id,
      content: 'Ticket created - Security vulnerability found in logs.',
    },
  });

  // Comments for ticket 8
  await prisma.comment.create({
    data: {
      ticketId: ticket8.id,
      userId: endUser2.id,
      content: 'Ticket created - Database connection errors occurring frequently.',
    },
  });

  await prisma.comment.create({
    data: {
      ticketId: ticket8.id,
      userId: agentUser.id,
      content: 'I\'ve identified the issue with database connections. The connection pool was exhausted. I\'ve increased the pool size and added better error handling.',
    },
  });

  await prisma.comment.create({
    data: {
      ticketId: ticket8.id,
      userId: agentUser.id,
      content: 'Database connection issues have been resolved. The system should now be stable.',
    },
  });

  console.log('✅ Comments created');

  console.log('\n🎉 Database seeding completed successfully!');
  console.log('\n📋 Sample Data Created:');
  console.log('- 5 users (1 admin, 1 agent, 3 end users)');
  console.log('- 8 categories');
  console.log('- 8 tickets with various statuses');
  console.log('- 15 comments across different tickets');
  console.log('\n🔑 Default Login Credentials:');
  console.log('- Admin: admin@quickdesk.com / admin123');
  console.log('- Agent: agent@quickdesk.com / agent123');
  console.log('- Users: john.doe@example.com / user123, jane.smith@example.com / user123, bob.wilson@example.com / user123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
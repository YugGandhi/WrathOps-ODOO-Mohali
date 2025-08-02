const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Email templates
const emailTemplates = {
  ticketCreated: (ticket, user) => ({
    subject: `Ticket Created - #${ticket.id}`,
    html: `
      <h2>Ticket Created Successfully</h2>
      <p>Hello ${user.name},</p>
      <p>Your ticket has been created successfully.</p>
      <h3>Ticket Details:</h3>
      <ul>
        <li><strong>Subject:</strong> ${ticket.subject}</li>
        <li><strong>Status:</strong> ${ticket.status}</li>
        <li><strong>Priority:</strong> ${ticket.priority}</li>
        <li><strong>Category:</strong> ${ticket.category?.name || 'Uncategorized'}</li>
      </ul>
      <p>You will receive updates when your ticket status changes.</p>
    `
  }),

  ticketStatusChanged: (ticket, user, oldStatus, newStatus) => ({
    subject: `Ticket Status Updated - #${ticket.id}`,
    html: `
      <h2>Ticket Status Updated</h2>
      <p>Hello ${user.name},</p>
      <p>Your ticket status has been updated.</p>
      <h3>Ticket Details:</h3>
      <ul>
        <li><strong>Subject:</strong> ${ticket.subject}</li>
        <li><strong>Previous Status:</strong> ${oldStatus}</li>
        <li><strong>New Status:</strong> ${newStatus}</li>
        <li><strong>Priority:</strong> ${ticket.priority}</li>
      </ul>
      <p>You can view your ticket details in your dashboard.</p>
    `
  }),

  ticketAssigned: (ticket, user, agent) => ({
    subject: `Ticket Assigned - #${ticket.id}`,
    html: `
      <h2>Ticket Assigned to Support Agent</h2>
      <p>Hello ${user.name},</p>
      <p>Your ticket has been assigned to a support agent.</p>
      <h3>Ticket Details:</h3>
      <ul>
        <li><strong>Subject:</strong> ${ticket.subject}</li>
        <li><strong>Assigned To:</strong> ${agent.name}</li>
        <li><strong>Status:</strong> ${ticket.status}</li>
      </ul>
      <p>You will receive updates as the agent works on your ticket.</p>
    `
  }),

  newComment: (ticket, user, comment) => ({
    subject: `New Comment on Ticket - #${ticket.id}`,
    html: `
      <h2>New Comment Added</h2>
      <p>Hello ${user.name},</p>
      <p>A new comment has been added to your ticket.</p>
      <h3>Ticket Details:</h3>
      <ul>
        <li><strong>Subject:</strong> ${ticket.subject}</li>
        <li><strong>Comment By:</strong> ${comment.user.name}</li>
      </ul>
      <h3>Comment:</h3>
      <p>${comment.content}</p>
      <p>You can view the full conversation in your dashboard.</p>
    `
  })
};

// Send email function
const sendEmail = async (to, template, data) => {
  try {
    const emailContent = emailTemplates[template](data.ticket, data.user, data.oldStatus, data.newStatus, data.agent, data.comment);
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: emailContent.subject,
      html: emailContent.html
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error('Email sending failed:', error);
  }
};

module.exports = {
  sendEmail,
  emailTemplates
}; 
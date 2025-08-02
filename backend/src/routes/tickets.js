const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, authorizeRoles, authorizeTicketAccess } = require('../middleware/auth');
const { validate, ticketSchemas } = require('../middleware/validation');
const { upload, handleUploadError } = require('../middleware/upload');
const { sendEmail } = require('../services/emailService');

const router = express.Router();
const prisma = new PrismaClient();

// Get user's tickets (End Users)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, category, priority, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Build where clause
    let whereClause = {};
    
    if (userRole === 'END_USER') {
      whereClause.creatorId = userId;
    }

    if (status && status !== 'all') {
      whereClause.status = status;
    }

    if (category && category !== 'all') {
      whereClause.categoryId = category;
    }

    if (priority && priority !== 'all') {
      whereClause.priority = priority;
    }

    if (search) {
      whereClause.OR = [
        { subject: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Build orderBy clause
    let orderBy = {};
    if (sortBy === '_count.comments') {
      orderBy.comments = { _count: sortOrder };
    } else {
      orderBy[sortBy] = sortOrder;
    }

    // Get tickets with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [tickets, total] = await Promise.all([
      prisma.ticket.findMany({
        where: whereClause,
        include: {
          category: true,
          creator: {
            select: { id: true, name: true, email: true }
          },
          assignedTo: {
            select: { id: true, name: true, email: true }
          },
          comments: {
            include: {
              user: {
                select: { id: true, name: true, email: true }
              }
            },
            orderBy: { createdAt: 'desc' }
          },
          attachments: {
            select: { id: true, filename: true, originalName: true, size: true }
          },
          _count: {
            select: { comments: true, attachments: true }
          }
        },
        orderBy: orderBy,
        skip,
        take: parseInt(limit)
      }),
      prisma.ticket.count({ where: whereClause })
    ]);

    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: {
        tickets,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get tickets'
    });
  }
});

// Get all tickets (Agents/Admins)
router.get('/all', authenticateToken, authorizeRoles('AGENT', 'ADMIN'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status, category, priority, search, assignedTo } = req.query;

    // Build where clause
    let whereClause = {};

    if (status && status !== 'all') {
      whereClause.status = status;
    }

    if (category && category !== 'all') {
      whereClause.categoryId = category;
    }

    if (priority && priority !== 'all') {
      whereClause.priority = priority;
    }

    if (assignedTo && assignedTo !== 'all') {
      if (assignedTo === 'unassigned') {
        whereClause.assignedToId = null;
      } else {
        whereClause.assignedToId = assignedTo;
      }
    }

    if (search) {
      whereClause.OR = [
        { subject: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Get tickets with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [tickets, total] = await Promise.all([
      prisma.ticket.findMany({
        where: whereClause,
        include: {
          category: true,
          creator: {
            select: { id: true, name: true, email: true }
          },
          assignedTo: {
            select: { id: true, name: true, email: true }
          },
          comments: {
            include: {
              user: {
                select: { id: true, name: true, email: true }
              }
            },
            orderBy: { createdAt: 'desc' }
          },
          attachments: {
            select: { id: true, filename: true, originalName: true, size: true }
          },
          _count: {
            select: { comments: true, attachments: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.ticket.count({ where: whereClause })
    ]);

    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: {
        tickets,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get all tickets error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get tickets'
    });
  }
});

// Get specific ticket
router.get('/:id', authenticateToken, authorizeTicketAccess, async (req, res) => {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: req.params.id },
      include: {
        category: true,
        creator: {
          select: { id: true, name: true, email: true }
        },
        assignedTo: {
          select: { id: true, name: true, email: true }
        },
        comments: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          },
          orderBy: { createdAt: 'asc' }
        },
        attachments: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    res.json({
      success: true,
      data: { ticket }
    });
  } catch (error) {
    console.error('Get ticket error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get ticket'
    });
  }
});

// Create new ticket with file upload
router.post('/', authenticateToken, upload.array('attachments', 5), handleUploadError, validate(ticketSchemas.create), async (req, res) => {
  try {
    const { subject, description, categoryId, priority = 'MEDIUM' } = req.body;

    // Create ticket
    const ticket = await prisma.ticket.create({
      data: {
        subject,
        description,
        priority,
        categoryId: categoryId || null,
        creatorId: req.user.id,
        status: 'OPEN'
      },
      include: {
        category: true,
        creator: {
          select: { id: true, name: true, email: true }
        },
        _count: {
          select: { comments: true, attachments: true }
        }
      }
    });

    // Send email notification to ticket creator
    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      try {
        await sendEmail(ticket.creator.email, 'ticketCreated', {
          ticket,
          user: ticket.creator
        });
      } catch (error) {
        console.error('Failed to send email notification:', error);
      }
    }

    // Handle file attachments
    if (req.files && req.files.length > 0) {
      const attachments = req.files.map(file => ({
        ticketId: ticket.id,
        userId: req.user.id,
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size
      }));

      await prisma.attachment.createMany({
        data: attachments
      });

      // Get updated ticket with attachments
      const updatedTicket = await prisma.ticket.findUnique({
        where: { id: ticket.id },
        include: {
          category: true,
          creator: {
            select: { id: true, name: true, email: true }
          },
          comments: [],
          attachments: {
            include: {
              user: {
                select: { id: true, name: true, email: true }
              }
            }
          },
          _count: {
            select: { comments: true, attachments: true }
          }
        }
      });

      return res.status(201).json({
        success: true,
        message: 'Ticket created successfully',
        data: { ticket: updatedTicket }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Ticket created successfully',
      data: { ticket }
    });
  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create ticket'
    });
  }
});

// Update ticket status
router.patch('/:id/status', authenticateToken, authorizeTicketAccess, validate(ticketSchemas.updateStatus), async (req, res) => {
  try {
    const { status } = req.body;
    const ticketId = req.params.id;

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        category: true,
        creator: {
          select: { id: true, name: true, email: true }
        },
        assignedTo: {
          select: { id: true, name: true, email: true }
        },
        _count: {
          select: { comments: true, attachments: true }
        }
      }
    });

    // Update ticket status
    const updatedTicket = await prisma.ticket.update({
      where: { id: ticketId },
      data: { status },
      include: {
        category: true,
        creator: {
          select: { id: true, name: true, email: true }
        },
        assignedTo: {
          select: { id: true, name: true, email: true }
        },
        _count: {
          select: { comments: true, attachments: true }
        }
      }
    });

    // Send email notification to ticket creator
    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      try {
        await sendEmail(updatedTicket.creator.email, 'ticketStatusChanged', {
          ticket: updatedTicket,
          user: updatedTicket.creator,
          oldStatus: ticket.status,
          newStatus: status
        });
      } catch (error) {
        console.error('Failed to send email notification:', error);
      }
    }

    res.json({
      success: true,
      message: 'Ticket status updated successfully',
      data: { ticket: updatedTicket }
    });
  } catch (error) {
    console.error('Update ticket status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update ticket status'
    });
  }
});

// Assign ticket to agent
router.patch('/:id/assign', authenticateToken, authorizeRoles('AGENT', 'ADMIN'), validate(ticketSchemas.assign), async (req, res) => {
  try {
    const { agentId } = req.body;
    const ticketId = req.params.id;

    // Verify agent exists and has agent role
    const agent = await prisma.user.findUnique({
      where: { id: agentId }
    });

    if (!agent || (agent.role !== 'AGENT' && agent.role !== 'ADMIN')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid agent ID or user is not an agent'
      });
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id: ticketId },
      data: { assignedToId: agentId },
      include: {
        category: true,
        creator: {
          select: { id: true, name: true, email: true }
        },
        assignedTo: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    res.json({
      success: true,
      message: 'Ticket assigned successfully',
      data: { ticket: updatedTicket }
    });
  } catch (error) {
    console.error('Assign ticket error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to assign ticket'
    });
  }
});

// Add comment to ticket
router.post('/:id/comments', authenticateToken, authorizeTicketAccess, validate(ticketSchemas.comment), async (req, res) => {
  try {
    const { content } = req.body;
    const ticketId = req.params.id;
    const userId = req.user.id;

    const comment = await prisma.comment.create({
      data: {
        ticketId,
        userId,
        content
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: { comment }
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add comment'
    });
  }
});

module.exports = router; 
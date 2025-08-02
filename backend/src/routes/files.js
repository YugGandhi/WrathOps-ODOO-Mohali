const express = require('express');
const path = require('path');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Download file attachment
router.get('/:filename', authenticateToken, async (req, res) => {
  try {
    const { filename } = req.params;
    
    // Find attachment in database
    const attachment = await prisma.attachment.findFirst({
      where: { filename },
      include: {
        ticket: {
          include: {
            creator: true,
            assignedTo: true
          }
        },
        user: true
      }
    });

    if (!attachment) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
    }

    // Check if user has access to the ticket
    const userId = req.user.id;
    const userRole = req.user.role;
    
    const hasAccess = 
      attachment.ticket.creatorId === userId ||
      attachment.ticket.assignedToId === userId ||
      userRole === 'ADMIN' ||
      (userRole === 'AGENT' && attachment.ticket.assignedToId === userId);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Get file path
    const filePath = path.join(__dirname, '../../uploads', filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: 'File not found on server'
      });
    }

    // Set headers for download
    res.setHeader('Content-Disposition', `attachment; filename="${attachment.originalName}"`);
    res.setHeader('Content-Type', attachment.mimeType);
    res.setHeader('Content-Length', attachment.size);

    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

  } catch (error) {
    console.error('Download file error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to download file'
    });
  }
});

// Get file info (for preview)
router.get('/:filename/info', authenticateToken, async (req, res) => {
  try {
    const { filename } = req.params;
    
    const attachment = await prisma.attachment.findFirst({
      where: { filename },
      include: {
        ticket: {
          include: {
            creator: true,
            assignedTo: true
          }
        },
        user: true
      }
    });

    if (!attachment) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
    }

    // Check access
    const userId = req.user.id;
    const userRole = req.user.role;
    
    const hasAccess = 
      attachment.ticket.creatorId === userId ||
      attachment.ticket.assignedToId === userId ||
      userRole === 'ADMIN' ||
      (userRole === 'AGENT' && attachment.ticket.assignedToId === userId);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: {
        attachment: {
          id: attachment.id,
          filename: attachment.filename,
          originalName: attachment.originalName,
          mimeType: attachment.mimeType,
          size: attachment.size,
          createdAt: attachment.createdAt,
          user: {
            id: attachment.user.id,
            name: attachment.user.name,
            email: attachment.user.email
          }
        }
      }
    });

  } catch (error) {
    console.error('Get file info error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get file info'
    });
  }
});

module.exports = router; 
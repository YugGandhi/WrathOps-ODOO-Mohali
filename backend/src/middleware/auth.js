const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        error: 'Access token required' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    // Check if user is banned
    if (user.status === 'BANNED') {
      return res.status(403).json({ 
        success: false, 
        error: 'Account has been banned' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        error: 'Token expired' 
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid token' 
      });
    }

    return res.status(500).json({ 
      success: false, 
      error: 'Authentication failed' 
    });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Authentication required' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        error: 'Insufficient permissions' 
      });
    }

    next();
  };
};

const authorizeTicketAccess = async (req, res, next) => {
  try {
    const { id: ticketId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        creator: {
          select: { id: true, name: true, email: true }
        },
        assignedTo: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    if (!ticket) {
      return res.status(404).json({ 
        success: false, 
        error: 'Ticket not found' 
      });
    }

    // Admin and agents can access all tickets
    if (userRole === 'ADMIN' || userRole === 'AGENT') {
      req.ticket = ticket;
      return next();
    }

    // End users can only access their own tickets
    if (ticket.creatorId === userId) {
      req.ticket = ticket;
      return next();
    }

    return res.status(403).json({ 
      success: false, 
      error: 'Access denied to this ticket' 
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to verify ticket access' 
    });
  }
};

module.exports = {
  authenticateToken,
  authorizeRoles,
  authorizeTicketAccess
}; 
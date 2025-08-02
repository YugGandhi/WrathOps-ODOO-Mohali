const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { validate, categorySchemas } = require('../middleware/validation');

const router = express.Router();
const prisma = new PrismaClient();

// Get all categories (public endpoint)
router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { tickets: true }
        }
      }
    });

    res.json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get categories'
    });
  }
});

// Create new category (admin only)
router.post('/', authenticateToken, authorizeRoles('ADMIN'), validate(categorySchemas.create), async (req, res) => {
  try {
    const { name, description } = req.body;

    // Check if category already exists
    const existingCategory = await prisma.category.findUnique({
      where: { name }
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        error: 'Category with this name already exists'
      });
    }

    const category = await prisma.category.create({
      data: { 
        name,
        description: description || null
      },
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: { category }
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create category'
    });
  }
});

// Update category (admin only)
router.put('/:id', authenticateToken, authorizeRoles('ADMIN'), validate(categorySchemas.update), async (req, res) => {
  try {
    const { name, description } = req.body;
    const categoryId = req.params.id;

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    // Check if new name already exists (excluding current category)
    const duplicateCategory = await prisma.category.findFirst({
      where: {
        name,
        id: { not: categoryId }
      }
    });

    if (duplicateCategory) {
      return res.status(400).json({
        success: false,
        error: 'Category with this name already exists'
      });
    }

    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: { 
        name,
        description: description || null
      },
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: { category: updatedCategory }
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update category'
    });
  }
});

// Delete category (admin only)
router.delete('/:id', authenticateToken, authorizeRoles('ADMIN'), async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        _count: {
          select: { tickets: true }
        }
      }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    // Check if category has tickets
    if (category._count.tickets > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete category that has tickets. Please reassign or delete the tickets first.'
      });
    }

    await prisma.category.delete({
      where: { id: categoryId }
    });

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete category'
    });
  }
});

// Get category by ID
router.get('/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { tickets: true }
        }
      }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    res.json({
      success: true,
      data: { category }
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get category'
    });
  }
});

// Toggle category status (admin only)
router.patch('/:id/toggle', authenticateToken, authorizeRoles('ADMIN'), async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    // Toggle status
    const newStatus = existingCategory.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: { status: newStatus },
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json({
      success: true,
      message: `Category status updated to ${newStatus}`,
      data: { category: updatedCategory }
    });
  } catch (error) {
    console.error('Toggle category status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to toggle category status'
    });
  }
});

module.exports = router; 
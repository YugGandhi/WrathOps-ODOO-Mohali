const Joi = require('joi');

// Validation schemas
const authSchemas = {
  register: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
};

const ticketSchemas = {
  create: Joi.object({
    subject: Joi.string().min(5).max(255).required(),
    description: Joi.string().min(10).required(),
    categoryId: Joi.string().uuid().optional(),
    priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'URGENT').default('MEDIUM')
  }),

  updateStatus: Joi.object({
    status: Joi.string().valid('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED').required()
  }),

  assign: Joi.object({
    agentId: Joi.string().uuid().required()
  }),

  comment: Joi.object({
    content: Joi.string().min(1).max(1000).required()
  })
};

const categorySchemas = {
  create: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    description: Joi.string().max(500).optional()
  }),

  update: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    description: Joi.string().max(500).optional()
  })
};

const userSchemas = {
  updateRole: Joi.object({
    role: Joi.string().valid('END_USER', 'AGENT', 'ADMIN').required()
  }),

  updateStatus: Joi.object({
    status: Joi.string().valid('ACTIVE', 'BANNED').required()
  })
};

// Validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }
    next();
  };
};

module.exports = {
  validate,
  authSchemas,
  ticketSchemas,
  categorySchemas,
  userSchemas
}; 
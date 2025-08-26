const Joi = require('joi');

const createPaperSchema = Joi.object({
  title: Joi.string().trim().min(2).max(255).required(),
  subject: Joi.string().trim().min(2).max(100).required(),
  grade: Joi.number().integer().min(1).max(13).required(),
  year: Joi.number().integer().min(1990).max(new Date().getFullYear()).required(),
});

const listQuerySchema = Joi.object({
  grade: Joi.number().integer().min(1).max(13).optional(),
  subject: Joi.string().trim().min(1).max(100).optional(),
  year: Joi.number().integer().min(1990).max(new Date().getFullYear()).optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(200).default(50),
});

function sanitizeEmptyStrings(obj) {
  const out = { ...obj };
  Object.keys(out).forEach(k => {
    if (out[k] === '') delete out[k];
  });
  return out;
}

function validateBody(schema) {
  return (req, res, next) => {
    const data = sanitizeEmptyStrings(req.body || {});
    const { value, error } = schema.validate(data, { abortEarly: false, convert: true });
    if (error) return res.status(400).json({ success: false, error: 'Validation failed', details: error.details });
    req.body = value;
    next();
  };
}

function validateQuery(schema) {
  return (req, res, next) => {
    const data = sanitizeEmptyStrings(req.query || {});
    const { value, error } = schema.validate(data, { abortEarly: false, convert: true });
    if (error) return res.status(400).json({ success: false, error: 'Validation failed', details: error.details });
    req.query = value;
    next();
  };
}

module.exports = {
  createPaperSchema,
  listQuerySchema,
  validateBody,
  validateQuery
};

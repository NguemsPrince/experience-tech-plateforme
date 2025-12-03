const mongoose = require('mongoose');

/**
 * Escape special regex characters to prevent regex injection
 * @param {string} str - String to escape
 * @returns {string} - Escaped string safe for regex
 */
function escapeRegex(str) {
  if (!str || typeof str !== 'string') {
    return '';
  }
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Validate MongoDB ObjectId
 * @param {string} id - ObjectId to validate
 * @returns {boolean} - True if valid ObjectId
 */
function isValidObjectId(id) {
  if (!id || typeof id !== 'string') {
    return false;
  }
  return mongoose.Types.ObjectId.isValid(id);
}

/**
 * Sanitize string input to prevent XSS
 * @param {string} input - String to sanitize
 * @returns {string} - Sanitized string
 */
function sanitizeString(input) {
  if (typeof input !== 'string') {
    return '';
  }
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim()
    .substring(0, 10000); // Limit length
}

/**
 * Sanitize object recursively to prevent XSS
 * @param {any} input - Input to sanitize
 * @returns {any} - Sanitized input
 */
function sanitizeInput(input) {
  if (typeof input === 'string') {
    return sanitizeString(input);
  }
  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }
  if (typeof input === 'object' && input !== null) {
    const sanitized = {};
    for (const key in input) {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        sanitized[key] = sanitizeInput(input[key]);
      }
    }
    return sanitized;
  }
  return input;
}

/**
 * Validate and sanitize search query
 * @param {string} query - Search query
 * @param {number} maxLength - Maximum length (default: 100)
 * @returns {string} - Sanitized and escaped search query
 */
function sanitizeSearchQuery(query, maxLength = 100) {
  if (!query || typeof query !== 'string') {
    return '';
  }
  const sanitized = sanitizeString(query);
  const trimmed = sanitized.substring(0, maxLength);
  return escapeRegex(trimmed);
}

/**
 * Validate pagination parameters
 * @param {any} page - Page number
 * @param {any} limit - Items per page
 * @param {number} maxLimit - Maximum limit (default: 100)
 * @returns {{page: number, limit: number}} - Validated pagination params
 */
function validatePagination(page, limit, maxLimit = 100) {
  const parsedPage = parseInt(page) || 1;
  const parsedLimit = parseInt(limit) || 20;
  
  return {
    page: Math.max(1, parsedPage),
    limit: Math.min(Math.max(1, parsedLimit), maxLimit)
  };
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email
 */
function isValidEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim().toLowerCase());
}

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid phone
 */
function isValidPhone(phone) {
  if (!phone || typeof phone !== 'string') {
    return false;
  }
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.trim());
}

module.exports = {
  escapeRegex,
  isValidObjectId,
  sanitizeString,
  sanitizeInput,
  sanitizeSearchQuery,
  validatePagination,
  isValidEmail,
  isValidPhone
};


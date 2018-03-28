const { createError } = require('apollo-errors');

module.exports = createError('InvalidPasswordError', {
  message: 'Invalid password.'
});

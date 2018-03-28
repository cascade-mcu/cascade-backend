const { createError } = require('apollo-errors');

module.exports = createError('InvalidEmailError', {
  message: 'Invalid email.'
});

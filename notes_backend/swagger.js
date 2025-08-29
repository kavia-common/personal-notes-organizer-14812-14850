const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Notes API',
      version: '1.0.0',
      description: 'A simple Express API documented with Swagger for managing personal notes.',
    },
    tags: [
      { name: 'Notes', description: 'CRUD operations for personal notes' },
    ],
  },
  // Ensure both index and notes route files are included
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;

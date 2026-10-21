const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    version: '1.0.0',            // by default: '1.0.0'
    title: 'LMSBackend',              // by default: 'REST API'
    description: 'LMS Backend Releated all APIs'         // by default: ''
  },
  host: 'https://lms-harshdepani.vercel.app',                 // by default: 'localhost:3000'
  basePath: '/api/v2/',             // by default: '/'
  schemes: [],              // by default: ['http']
  consumes: [],             // by default: ['application/json']
  produces: [],             // by default: ['application/json']
  tags: [                   // by default: empty Array
    {
      name: 'category',             // Tag name
      description: 'category releated APIs'       // Tag description
    },

    {
      name: 'course',             // Tag name
      description: 'course releated APIs'       // Tag description
    },

    {
      name: 'user',             // Tag name
      description: 'user releated APIs'       // Tag description
    },

    {
      name: 'terms',             // Tag name
      description: 'terms releated APIs'       // Tag description
    },
    // { ... }
  ],
  securityDefinitions: {
    apiKeyAuth: {
      type: 'apiKey',
      in: 'header', // can be 'header', 'query' or 'cookie'
      name: 'Authorization', // name of the header, query parameter or cookie
      description: 'JWT Token'
    }
  },  // by default: empty object
  definitions: {}           // by default: empty object
};

const outputFile = '../swagger-output.json';
const routes = ['../routers/api/v2/index.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);
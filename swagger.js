const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger.json'
const endpointsFiles = ['./index.js']

const doc = {
    info: {
        title: 'Test API',
        version: "1.0.0",
    },
    host: 'localhost:3000',
    basePath: '/',
    schemes: ['http'],
}

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./index.js'); // project's root file
  });

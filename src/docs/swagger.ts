import swaggerJSDoc, { OAS3Definition, OAS3Options } from 'swagger-jsdoc';
import tags from './tags';
import schemas from './schemas';

const swaggerDefinition: OAS3Definition = {
  openapi: '3.0.0',
  info: {
    title: 'Documentacion de mi API',
    version: '1.0.0',
  },
  servers: [
    {
      url: 'http://localhost:8080',
    },
    {
      url: 'http://192.168.1.106:8080',
    },
  ],
  tags,
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
      },
    },
    schemas,
  },
};

const swaggerOptions: OAS3Options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts'],
};

export default swaggerJSDoc(swaggerOptions);

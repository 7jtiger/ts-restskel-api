import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Skel API',
      version: '1.0.0',
      description: 'API documentation for Skel API',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // API 라우트 파일 경로
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };
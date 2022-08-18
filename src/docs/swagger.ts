import swaggerJSDoc, { OAS3Definition, OAS3Options } from 'swagger-jsdoc';

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
  ],
  tags: [
    {
      name: 'Auth',
      description: 'All end point for register and auth',
    },
    {
      name: 'Category',
      description: 'All end point for admin categories.',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
      },
    },
    schemas: {
      image: {
        type: 'object',
        properties: {
          publicId: {
            type: 'string',
            example: 'image-folder/image-name',
          },
          width: {
            type: 'number',
            example: 1080,
          },
          height: {
            type: 'number',
            example: 1080,
          },
          format: {
            type: 'string',
            example: 'image',
          },
          type: {
            type: 'string',
            example: 'jpg',
          },
          url: {
            type: 'string',
            example: 'http://image-url.com',
          },
        },
      },
      user: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            example: 'Jhon Doe',
          },
          email: {
            type: 'string',
            example: 'jhondoe@email',
          },
          profilePhoto: {
            $ref: '#/components/schemas/image',
          },
          role: {
            type: 'string',
            example: 'admin',
          },
        },
      },
      registerUser: {
        type: 'object',
        required: ['name', 'email', 'password', 'confirmPassword'],
        properties: {
          name: {
            type: 'string',
            example: 'Jhon Doe',
          },
          email: {
            type: 'string',
            example: 'jhondoe@email.com',
          },
          password: {
            type: 'string',
            example: 'Clave123*',
          },
          confirmPassword: {
            type: 'string',
            example: 'Clave123*',
          },
        },
      },
      loginUser: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            example: 'jhondoe@email.com',
          },
          password: {
            type: 'string',
            example: 'Clave123*',
          },
        },
      },
      authResponse: {
        type: 'object',
        properties: {
          ok: {
            type: 'boolean',
            example: true,
          },
          token: {
            type: 'string',
            example:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyZmJkMjQwNGU3MzM0YTllNTVmZTEyYyIsImlhdCI6MTY2MDY3MDUyOSwiZXhwIjoxNjYwNzU2OTI5fQ.WPw9CJqHOyozd7XNMpVFWyxmqdzUugPxTMsv0w_YoV0',
          },
          user: {
            $ref: '#/components/schemas/user',
          },
        },
      },
      validationError: {
        type: 'object',
        properties: {
          ok: {
            type: 'boolean',
            example: false,
          },
          message: {
            type: 'string',
            example: 'Error de validación',
          },
          validationErrors: {
            type: 'object',
            properties: {
              propertyName: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    example: 'ValidationError',
                  },
                  message: {
                    type: 'string',
                    example: '"Ya existe un usuario registrado con este correo."',
                  },
                  kind: {
                    type: 'string',
                    example: 'user defined',
                  },
                  path: {
                    type: 'string',
                    example: 'email',
                  },
                  value: {
                    type: 'string',
                    example: 'jhondoe@email.com',
                  },
                },
              },
            },
          },
        },
      },
      registerCategory: {
        type: 'object',
        required: ['name'],
        properties: {
          name: {
            type: 'string',
            example: 'Categoría 1',
          },
          description: {
            type: 'string',
            example: 'This is a description of category and completly optional.',
          },
          image: {
            type: 'string',
            format: 'binary',
          },
        },
      },
      newCategory: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
          },
          name: {
            type: 'string',
            example: 'Categoría 1',
          },
          slug: {
            type: 'string',
            example: 'categoria-1',
          },
          description: {
            type: 'string',
            example: 'Una descripción muy descriptiva.',
          },
          image: {
            $ref: '#/components/schemas/image',
          },
          order: {
            type: 'number',
            example: 1,
          },
          isEnabled: {
            type: 'boolean',
            example: true,
          },
          products: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          urlSlug: {
            type: 'string',
            example: 'categoria-1',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
    },
  },
};

const swaggerOptions: OAS3Options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts'],
};

export default swaggerJSDoc(swaggerOptions);

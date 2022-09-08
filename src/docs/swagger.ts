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
    {
      url: 'http://192.168.0.120:8080',
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
    {
      name: 'Boxes',
      description: 'All end points for admin boxes, closings and transactions',
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
          emailVerifiedAt: {
            type: 'boolean',
            example: true,
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
      categoryLite: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
          },
          mainCategory: {
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
          level: {
            type: 'number',
            example: 0,
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
          subcategories: {
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
      showCategory: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
          },
          mainCategory: {
            $ref: '#/components/schemas/categoryLite',
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
          level: {
            type: 'number',
            example: 0,
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
          subcategories: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/categoryLite',
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
      updateCategory: {
        type: 'object',
        required: ['name'],
        properties: {
          name: {
            type: 'string',
            example: 'Categoría 1',
          },
          description: {
            type: 'string',
            example: 'Una descripción muy descriptiva.',
          },
          order: {
            type: 'number',
            example: 1,
          },
          isEnabled: {
            type: 'boolean',
            example: true,
          },
          image: {
            type: 'string',
            format: 'binary',
          },
        },
      },
      updateCategoryOrderRequest: {
        type: 'object',
        required: ['categoryIds'],
        properties: {
          categoryIds: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          mainCategory: {
            type: 'string',
          },
        },
      },
      // ----------------------------------------------------------------------
      // CASHBOX
      // ----------------------------------------------------------------------
      cashboxLite: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
          },
          cashier: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
              },
              name: {
                type: 'string',
                example: 'Cashier name',
              },
            },
          },
          users: {
            type: 'array',
            items: {
              type: 'string',
              example: ['eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'],
            },
          },
          name: {
            type: 'string',
            example: 'Box name',
          },
          cashierName: {
            type: 'string',
            example: 'Jhon Doe',
          },
          base: {
            type: 'number',
            example: 100000,
          },
          openBox: {
            type: 'string',
            format: 'date-time',
          },
          closed: {
            type: 'string',
            format: 'date-time',
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
      newCashboxRequest: {
        type: 'object',
        required: ['name'],
        properties: {
          name: {
            type: 'string',
            example: 'name of new box',
          },
          userIds: {
            type: 'array',
            items: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
            },
          },
        },
      },
      updateCashboxRequest: {
        type: 'object',
        required: ['name'],
        properties: {
          name: {
            type: 'string',
            example: 'name of cashbox',
          },
        },
      },
      updateCashboxResponse: {
        type: 'object',
        properties: {
          cashbox: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
              },
              name: {
                type: 'string',
                example: 'The new name of box',
              },
            },
          },
        },
      },
      fullCashbox: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
          },
          cashier: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
              },
              name: {
                type: 'string',
                example: 'Cashier name',
              },
            },
          },
          users: {
            type: 'array',
            items: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
            },
          },
          name: {
            type: 'string',
            example: 'Box name',
          },
          base: {
            type: 'number',
            example: 100000,
          },
          lastClosing: {
            type: 'string',
            format: 'date-time',
          },
          transactions: {
            type: 'array',
            items: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
            },
          },
          closingRecords: {
            type: 'array',
            items: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
            },
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
      openBoxRequest: {
        type: 'object',
        required: ['cashierId', 'base'],
        properties: {
          cashierId: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
          },
          base: {
            type: 'number',
            example: 100000,
          },
        },
      },
      openBoxResponse: {
        type: 'object',
        required: ['cashierId', 'base'],
        properties: {
          cashbox: {
            $ref: '#/components/schemas/fullCashbox',
          },
        },
      },
      closingRecordLite: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
          },
          cashbox: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
          },
          user: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
          },
          cashier: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
          },
          userName: {
            type: 'string',
            example: 'Administrador',
          },
          cashierName: {
            type: 'string',
            example: 'Cashier Name',
          },
          boxName: {
            type: 'string',
            example: 'Cashier Name',
          },
          opened: {
            type: 'string',
            format: 'date-time',
          },
          closingDate: {
            type: 'string',
            format: 'date-time',
          },
          base: {
            type: 'number',
            example: 100000,
          },
          incomes: {
            type: 'number',
            example: 100000,
          },
          expenses: {
            type: 'number',
            example: 50000,
          },
          cash: {
            type: 'number',
            example: 140000,
          },
          coin: {
            type: 'object',
          },
          bills: {
            type: 'object',
          },
          leftover: {
            type: 'number',
            example: 1000,
          },
          missing: {
            type: 'number',
            example: 10000,
          },
          observation: {
            type: 'string',
            example: 'This is a observation.',
          },
          transactions: {
            type: 'array',
            items: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
            },
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
      closeBoxRequest: {
        type: 'object',
        required: ['cash'],
        properties: {
          cash: {
            type: 'number',
            example: 100000,
          },
          observation: {
            type: 'string',
            example: 'This is a good observatio about cashier.',
          },
        },
      },
      closeBoxResponse: {
        type: 'object',
        properties: {
          cashox: {
            $ref: '#/components/schemas/fullCashbox',
          },
          closing: {
            $ref: '#/components/schemas/closingRecordLite',
          },
        },
      },
      transaction: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
          },
          transactionDate: {
            type: 'string',
            format: 'date-time',
          },
          description: {
            type: 'string',
            example: 'This is a description of transaction',
          },
          isTransfer: {
            type: 'boolean',
            example: false,
          },
          amount: {
            type: 'number',
            example: 100000,
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
      newTransactionRequest: {
        type: 'object',
        required: ['description', 'amount'],
        properties: {
          date: {
            type: 'string',
            format: 'date-time',
          },
          description: {
            type: 'string',
            example: 'This is a required description to transaction',
          },
          amount: {
            type: 'number',
            example: 100000,
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

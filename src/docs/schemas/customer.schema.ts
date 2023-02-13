import { Reference, Schema } from 'swagger-jsdoc';

const schema: { [key: string]: Reference | Schema } = {
  customer: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: '6334705a7b25323cbbfbaffd',
      },
      user: {
        type: 'string',
        example: '6334705a7b25323cbbfbaffd',
      },
      firstName: {
        type: 'string',
        example: 'Jhon',
      },
      lastName: {
        type: 'string',
        example: 'Doe',
      },
      alias: {
        type: 'string',
        example: 'Mr. Brown',
      },
      observation: {
        type: 'string',
        example: 'This is a description',
      },
      email: {
        type: 'string',
        example: 'jhondoe@email',
      },
      contacts: {
        type: 'array',
        items: {
          type: 'object',
          required: ['phone', 'description'],
          properties: {
            id: {
              type: 'string',
              example: '6334705a7b25323cbbfbaffd',
            },
            phone: {
              type: 'string',
              example: '5555555',
            },
            description: {
              type: 'string',
              example: 'Personal Phone',
            },
          },
        },
      },
      address: {
        type: 'string',
        example: 'Falsy Street 1234',
      },
      documentType: {
        type: 'string',
        example: 'CC',
      },
      documentNumber: {
        type: 'string',
        example: '1234567890',
      },
      birthDate: {
        type: 'string',
        format: 'date',
      },
      fullName: {
        type: 'string',
        example: 'Jhon Doe',
      },
      balance: {
        type: 'number',
      },
      firstPendingInvoice: {
        type: 'string',
        format: 'date-time',
      },
      lastPendingInvoice: {
        type: 'string',
        format: 'date-time',
      },
      lastPayment: {
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
  customerWithInvoices: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: '6334705a7b25323cbbfbaffd',
      },
      user: {
        type: 'string',
        example: '6334705a7b25323cbbfbaffd',
      },
      firstName: {
        type: 'string',
        example: 'Jhon',
      },
      lastName: {
        type: 'string',
        example: 'Doe',
      },
      alias: {
        type: 'string',
        example: 'Mr. Brown',
      },
      observation: {
        type: 'string',
        example: 'This is a description',
      },
      email: {
        type: 'string',
        example: 'jhondoe@email',
      },
      contacts: {
        type: 'array',
        items: {
          type: 'object',
          required: ['phone', 'description'],
          properties: {
            id: {
              type: 'string',
              example: '6334705a7b25323cbbfbaffd',
            },
            phone: {
              type: 'string',
              example: '5555555',
            },
            description: {
              type: 'string',
              example: 'Personal Phone',
            },
          },
        },
      },
      address: {
        type: 'string',
        example: 'Falsy Street 1234',
      },
      documentType: {
        type: 'string',
        example: 'CC',
      },
      documentNumber: {
        type: 'string',
        example: '1234567890',
      },
      birthDate: {
        type: 'string',
        format: 'date',
      },
      fullName: {
        type: 'string',
        example: 'Jhon Doe',
      },
      balance: {
        type: 'number',
      },
      invoices: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/invoice',
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
  customerList: {
    type: 'object',
    properties: {
      customers: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/customer',
        },
      },
    },
  },
  storeCustomerRequest: {
    type: 'object',
    required: ['firstName'],
    properties: {
      firstName: {
        type: 'string',
        example: 'Jhon',
      },
      lastName: {
        type: 'string',
        example: 'Doe',
      },
      alias: {
        type: 'string',
        example: 'Mr. Brown',
      },
      observation: {
        type: 'string',
        example: 'This is a description',
      },
      email: {
        type: 'string',
        example: 'jhondoe@email',
      },
      contacts: {
        type: 'array',
        items: {
          type: 'object',
          required: ['phone', 'description'],
          properties: {
            phone: {
              type: 'string',
              example: '555-5555',
            },
            description: {
              type: 'string',
              example: 'Personal Phone',
            },
          },
        },
      },
      address: {
        type: 'string',
        example: 'Falsy Street 1234',
      },
      documentType: {
        type: 'string',
        example: 'CC',
      },
      documentNumber: {
        type: 'string',
        example: '1.234.567.890',
      },
      birthDate: {
        type: 'string',
        format: 'date',
      },
    },
  },
  storeCustomerResponse: {
    type: 'object',
    properties: {
      customer: {
        type: 'object',
        $ref: '#/components/schemas/customer',
      },
    },
  },
  updateCustomerRequest: {
    type: 'object',
    required: ['firstName'],
    properties: {
      firstName: {
        type: 'string',
        example: 'Jhon',
      },
      lastName: {
        type: 'string',
        example: 'Doe',
      },
      alias: {
        type: 'string',
        example: 'Mr. Brown',
      },
      observation: {
        type: 'string',
        example: 'This is a description',
      },
      email: {
        type: 'string',
        example: 'jhondoe@email',
      },
      address: {
        type: 'string',
        example: 'Falsy Street 1234',
      },
      documentType: {
        type: 'string',
        example: 'CC',
      },
      documentNumber: {
        type: 'string',
        example: '1.234.567.890',
      },
      birthDate: {
        type: 'string',
        format: 'date',
      },
    },
  },
  addContactRequest: {
    type: 'object',
    properties: {
      phone: {
        type: 'string',
        example: '123-456-7890',
      },
      description: {
        type: 'string',
        example: 'Office',
      },
    },
  },
  contactResponse: {
    type: 'object',
    properties: {
      contact: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '6334705a7b25323cbbfbaffd',
          },
          phone: {
            type: 'string',
            example: '1234567890',
          },
          description: {
            type: 'string',
            example: 'Office',
          },
        },
      },
    },
  },
  customerPaymentReport: {
    type: 'object',
    properties: {
      date: {
        type: 'string',
        format: 'date-time',
      },
      description: {
        type: 'string',
      },
      amount: {
        type: 'number',
      },
    },
  },
};

export default schema;

import { Reference, Schema } from 'swagger-jsdoc';

const schema: { [key: string]: Reference | Schema } = {
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
      balance: {
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
      balance: {
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
  closingRecordWithRef: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      },
      cashbox: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
          },
          name: {
            type: 'string',
            example: 'Cash box Name',
          },
        },
      },
      user: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
          },
          name: {
            type: 'string',
            example: 'User nname',
          },
        },
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
};

export default schema;

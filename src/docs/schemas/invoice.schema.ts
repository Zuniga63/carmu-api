import { Reference, Schema } from 'swagger-jsdoc';

const schema: { [key: string]: Reference | Schema } = {
  invoice: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: '6334705a7b25323cbbfbaffd',
      },
      seller: {
        type: 'string',
        example: '6334705a7b25323cbbfbaffd',
      },
      customer: {
        type: 'object',
        properties: {
          id: {
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
          fullName: {
            type: 'string',
            example: 'Jhon Doe',
          },
        },
      },
      isSeparate: {
        type: 'boolean',
        example: false,
      },
      prefix: {
        type: 'string',
        example: 'bs',
      },
      number: {
        type: 'number',
        example: 2,
      },
      prefixNumber: {
        type: 'string',
        example: 'bs-02',
      },
      customerName: {
        type: 'string',
        example: 'Jhon Doe',
      },
      customerAddress: {
        type: 'string',
        example: 'False street 1234',
      },
      costomerPhone: {
        type: 'string',
        example: '555555',
      },
      customerDocument: {
        type: 'string',
        example: '1234567890',
      },
      customerDocumentType: {
        type: 'string',
        example: 'CC',
      },
      sellerName: {
        type: 'string',
        example: 'Jhonny Underwod',
      },
      expeditionDate: {
        type: 'string',
        format: 'date-time',
      },
      expirationDate: {
        type: 'string',
        format: 'date-time',
      },
      subtotal: {
        type: 'number',
        example: 120000,
      },
      discount: {
        type: 'number',
        example: 20000,
      },
      amount: {
        type: 'number',
        example: 100000,
      },
      cash: {
        type: 'string',
        example: 80000,
      },
      credit: {
        type: 'string',
        example: 20000,
      },
      cashChange: {
        type: 'string',
        example: 0,
      },
      balance: {
        type: 'string',
        example: 20000,
      },
      cancel: {
        type: 'boolean',
        example: false,
      },
      cancelMessage: {
        type: 'string',
        example: 'This is a cancel message',
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
  storeInvoice: {
    type: 'object',
    required: ['expeditionDate', 'expirationDate', 'items'],
    properties: {
      sellerId: {
        type: 'string',
        example: '6334705a7b25323cbbfbaffd',
      },
      customerId: {
        type: 'string',
        example: '6334705a7b25323cbbfbaffd',
      },
      isSeparate: {
        type: 'boolean',
        example: false,
      },
      customerName: {
        type: 'string',
        example: 'Jhon Doe',
      },
      customerAddress: {
        type: 'string',
        example: 'False street 1234',
      },
      costomerPhone: {
        type: 'string',
        example: '555555',
      },
      customerDocument: {
        type: 'string',
        example: '1234567890',
      },
      customerDocumentType: {
        type: 'string',
        example: 'CC',
      },
      sellerName: {
        type: 'string',
        example: 'Jhonny Underwod',
      },
      expeditionDate: {
        type: 'string',
        format: 'date-time',
      },
      expirationDate: {
        type: 'string',
        format: 'date-time',
      },
      cash: {
        type: 'number',
        example: 50000,
      },
      items: {
        type: 'array',
        items: {
          type: 'object',
          required: ['description', 'quantity', 'unitValue'],
          properties: {
            categories: {
              type: 'array',
              items: {
                type: 'string',
                example: '6334705a7b25323cbbfbaffd',
              },
            },
            product: {
              type: 'string',
              example: '6334705a7b25323cbbfbaffd',
            },
            productSize: {
              type: 'string',
              example: '6334705a7b25323cbbfbaffd',
            },
            productColor: {
              type: 'string',
              example: '6334705a7b25323cbbfbaffd',
            },
            tags: {
              type: 'array',
              items: {
                type: 'string',
                example: '6334705a7b25323cbbfbaffd',
              },
            },
            description: {
              type: 'string',
              example: 'Item description',
            },
            quantity: {
              type: 'number',
              example: 2,
            },
            unitValue: {
              type: 'number',
              example: 2000,
            },
            discount: {
              type: 'number',
              example: 100,
            },
          },
        },
      },
      cashPayments: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            cashboxId: {
              type: 'string',
              example: '6334705a7b25323cbbfbaffd',
            },
            description: {
              type: 'string',
              example: 'Pago en efectivo',
            },
            amount: {
              type: 'number',
              example: 25000,
            },
            register: {
              type: 'boolean',
              example: false,
            },
          },
        },
      },
      registerWithOtherData: {
        type: 'boolean',
        example: false,
      },
    },
  },
  addInvoicePayment: {
    type: 'object',
    properties: {
      cashboxId: {
        type: 'string',
        example: '6334705a7b25323cbbfbaffd',
      },
      paymentDate: {
        type: 'string',
        format: 'date-time',
      },
      description: {
        type: 'string',
        example: 'Pago en efectivo',
      },
      amount: {
        type: 'number',
        example: 25000,
      },
      register: {
        type: 'boolean',
        example: false,
      },
    },
  },
  invoicePayment: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: '6334705a7b25323cbbfbaffd',
      },
      paymentDate: {
        type: 'string',
        format: 'date-time',
      },
      description: {
        type: 'string',
        example: 'Description optional for the payment.',
      },
      amount: {
        type: 'number',
        example: '100000',
      },
      initialPayment: {
        type: 'boolean',
        example: false,
      },
      cancel: {
        type: 'boolean',
        example: false,
      },
      cancelMessage: {
        type: 'string',
        example: 'Optional message for cancelation',
      },
    },
  },
  invoiceItem: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: '6334705a7b25323cbbfbaffd',
      },
      categories: {
        type: 'array',
        items: {
          type: 'string',
          example: '6334705a7b25323cbbfbaffd',
        },
      },
      product: {
        type: 'string',
        example: '6334705a7b25323cbbfbaffd',
      },
      productSize: {
        type: 'string',
        example: '6334705a7b25323cbbfbaffd',
      },
      productColor: {
        type: 'string',
        example: '6334705a7b25323cbbfbaffd',
      },
      tags: {
        type: 'array',
        items: {
          type: 'string',
          example: '6334705a7b25323cbbfbaffd',
        },
      },
      description: {
        type: 'string',
        example: 'Item description',
      },
      quantity: {
        type: 'number',
        example: 2,
      },
      unitValue: {
        type: 'number',
        example: 2000,
      },
      discount: {
        type: 'number',
        example: 100,
      },
      balane: {
        type: 'number',
        example: 3800,
      },
    },
  },
  addPaymentResponse: {
    type: 'object',
    properties: {
      payment: {
        type: 'Object',
        $ref: '#/components/schemas/invoicePayment',
      },
      items: {
        type: 'array',
        items: {
          type: 'object',
          $ref: '#/components/schemas/invoiceItem',
        },
      },
      message: {
        type: 'string',
        example: '¡Factura abonada con éxito!',
      },
    },
  },
};

export default schema;

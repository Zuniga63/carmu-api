import { Reference, Schema } from 'swagger-jsdoc';

const schema: { [key: string]: Reference | Schema } = {
  product: {
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
      tags: {
        type: 'array',
        items: {
          type: 'string',
          example: '6334705a7b25323cbbfbaffd',
        },
      },
      colors: {
        type: 'array',
        items: {
          type: 'string',
          example: '6334705a7b25323cbbfbaffd',
        },
      },
      size: {
        type: 'array',
        items: {
          type: 'string',
          example: '6334705a7b25323cbbfbaffd',
        },
      },
      name: {
        type: 'string',
        example: 'Amazing Product',
      },
      slug: {
        type: 'string',
        example: 'amazing-product',
      },
      ref: {
        type: 'string',
        example: 'amazing-product',
      },
      barcode: {
        type: 'string',
        example: 'amazing-product',
      },
      description: {
        type: 'string',
        example: 'This is a optional description for this product.',
      },
      image: {
        $ref: '#/components/schemas/image',
      },
      images: {
        type: 'array',
        items: {
          type: 'string',
          example: '6334705a7b25323cbbfbaffd',
        },
      },
      isInventoriable: {
        type: 'boolean',
        example: false,
      },
      stock: {
        type: 'number',
        example: 100,
      },
      price: {
        type: 'number',
        example: 100000,
      },
      hasDiscount: {
        type: 'boolean',
        example: false,
      },
      priceWithDiscount: {
        type: 'number',
        example: 90000,
      },
      productIsNew: {
        type: 'boolean',
        example: false,
      },
      published: {
        type: 'boolean',
        example: false,
      },
      sold: {
        type: 'number',
        example: 500,
      },
      returned: {
        type: 'number',
        example: 20,
      },
    },
  },
  productList: {
    type: 'object',
    properties: {
      products: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/product',
        },
      },
    },
  },
  newProduct: {
    type: 'object',
    properties: {
      categoryIds: {
        type: 'array',
        items: {
          type: 'string',
          example: '6334705a7b25323cbbfbaffd',
        },
      },
      image: {
        type: 'string',
        format: 'binary',
      },
      name: {
        type: 'string',
        example: 'Amazing Product',
      },
      ref: {
        type: 'string',
        example: 'amazing-product',
      },
      barcode: {
        type: 'string',
        example: 'amazing-product',
      },
      description: {
        type: 'string',
        example: 'This is a optional description for this product.',
      },
      isInventoriable: {
        type: 'boolean',
        example: false,
      },
      initialStock: {
        type: 'number',
        example: 100,
      },
      price: {
        type: 'number',
        example: 100000,
      },
      hasDiscount: {
        type: 'boolean',
        example: false,
      },
      priceWithDiscount: {
        type: 'number',
        example: 90000,
      },
      productIsNew: {
        type: 'boolean',
        example: false,
      },
      published: {
        type: 'boolean',
        example: false,
      },
    },
  },
  udpateProduct: {
    type: 'object',
    properties: {
      categoryIds: {
        type: 'array',
        items: {
          type: 'string',
          example: '6334705a7b25323cbbfbaffd',
        },
      },
      image: {
        type: 'string',
        format: 'binary',
      },
      name: {
        type: 'string',
        example: 'Amazing Product',
      },
      ref: {
        type: 'string',
        example: 'amazing-product',
      },
      barcode: {
        type: 'string',
        example: 'amazing-product',
      },
      description: {
        type: 'string',
        example: 'This is a optional description for this product.',
      },
      stock: {
        type: 'number',
        example: 100,
      },
      isInventoriable: {
        type: 'boolean',
        example: false,
      },
      price: {
        type: 'number',
        example: 100000,
      },
      hasDiscount: {
        type: 'boolean',
        example: false,
      },
      priceWithDiscount: {
        type: 'number',
        example: 90000,
      },
      productIsNew: {
        type: 'boolean',
        example: false,
      },
      published: {
        type: 'boolean',
        example: false,
      },
    },
  },
};

export default schema;

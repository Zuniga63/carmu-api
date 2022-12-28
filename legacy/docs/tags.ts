import { Tag } from 'swagger-jsdoc';

const tags: Tag[] = [
  {
    name: 'Auth',
    description: 'All endpoint for register and auth',
  },
  {
    name: 'Category',
    description: 'All endpoint for admin categories.',
  },
  {
    name: 'Boxes',
    description: 'All endpoints for admin boxes, closings and transactions',
  },
  {
    name: 'Main Box',
    description: 'Endpoints for admin all transaction and closures',
  },
  {
    name: 'Dashboard',
    description: 'Endpoint for get statictics and metrics',
  },
  {
    name: 'Customers',
    description: 'Endpoint for admin customers.',
  },
  {
    name: 'Products',
    description: 'Endpoints for admin products',
  },
  {
    name: 'Invoices',
    description: 'Endpoint for admin invoices',
  },
];

export default tags;

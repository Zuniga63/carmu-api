import { DocumentBuilder } from '@nestjs/swagger';

export default new DocumentBuilder()
  .setTitle(`${process.env.APP_NAME}`)
  .setDescription('This is an API for managment the carmú store')
  .setVersion('1.0')
  .addTag('Auth', 'End point for register and login')
  .addTag('Users', 'Route for user administration')
  .addTag('Roles', 'Routes for role administration')
  .addTag('Customers', 'Routes for customer management')
  .addBearerAuth()
  .build();

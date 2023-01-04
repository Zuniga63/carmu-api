import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import ValidationErrorDto from 'src/dto/validation-error.dto';
import { RequirePermissions } from '../auth/decorators/required-permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuards } from '../auth/guards/permissions.guard';
import { Permission } from '../auth/permission.enum';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomerDto } from './dto/customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customers')
@UseGuards(JwtAuthGuard, PermissionsGuards)
@ApiTags('Customers')
@ApiBearerAuth()
@ApiForbiddenResponse({
  description: 'Only user with the permissions can acces to this end points.',
})
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  // ------------------------------------------------------------------------------------
  // CREATE A NEW CUSTOMER
  // ------------------------------------------------------------------------------------
  @Post()
  @RequirePermissions(Permission.CREATE_NEW_CUSTOMER)
  @ApiOperation({
    summary: 'Create new Customer',
    description: 'This end point register new customer.',
  })
  @ApiCreatedResponse({
    description: 'The customer has been successfully created.',
    type: CustomerDto,
  })
  @ApiBadRequestResponse({
    description:
      'Some of the submitted field have not passed primary validation',
    type: ValidationErrorDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Has not passed the validation for saving in the database',
    type: ValidationErrorDto,
  })
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  // ------------------------------------------------------------------------------------
  // GET ALL CUSTOMERS
  // ------------------------------------------------------------------------------------
  @Get()
  @RequirePermissions(Permission.READ_CUSTOMER)
  @ApiOperation({
    summary: 'Get all customers',
    description: 'This end point retrive all customer records sorted by name',
  })
  @ApiOkResponse({ description: 'List of customers', type: [CustomerDto] })
  findAll() {
    return this.customersService.findAll();
  }

  // ------------------------------------------------------------------------------------
  // GET CUSTOMER BY ID
  // ------------------------------------------------------------------------------------
  @Get(':id')
  @RequirePermissions(Permission.READ_CUSTOMER)
  @ApiOperation({
    summary: 'Get customer by ID',
    description: 'This end point get a single customer data',
  })
  @ApiOkResponse({ description: 'Customer Data', type: CustomerDto })
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  // ------------------------------------------------------------------------------------
  // UPDATE CUSTOMER BY ID
  // ------------------------------------------------------------------------------------
  @Patch(':id')
  @RequirePermissions(Permission.UPDATE_CUSTOMER)
  @ApiOperation({
    summary: 'Update customer',
    description: 'This end point update the all customer data',
  })
  @ApiOkResponse({
    description: 'The updated customer',
    type: CustomerDto,
  })
  @ApiNotFoundResponse({
    description: 'Customer not Found',
  })
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto
  ) {
    return this.customersService.update(id, updateCustomerDto);
  }

  // ------------------------------------------------------------------------------------
  // DELETE CUSTOMER BY ID
  // ------------------------------------------------------------------------------------
  @Delete(':id')
  @RequirePermissions(Permission.DELETE_CUSTOMER)
  @ApiOperation({
    summary: 'Delete customer',
    description:
      'This end point delete the customer and update the correspond user',
  })
  @ApiOkResponse({
    description: 'The deleted customer',
    type: CustomerDto,
  })
  @ApiNotFoundResponse({
    description: 'Customer not Found',
  })
  remove(@Param('id') id: string) {
    return this.customersService.remove(id);
  }
}

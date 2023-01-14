import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
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
} from '@nestjs/swagger';
import { Request } from 'express';
import { RequirePermissions } from '../auth/decorators/required-permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuards } from '../auth/guards/permissions.guard';
import { Permission } from '../auth/permission.enum';
import { User } from '../users/schema/user.schema';
import { CashboxsService } from './cashboxs.service';
import CashboxWithAll from './dto/cashbox-with-all.dto';
import { CashboxDto } from './dto/cashbox.dto';
import { CreateCashboxDto } from './dto/create-cashbox.dto';
import { NewCashboxDto } from './dto/new-cashbox.dto';
import { UpdateCashboxDto } from './dto/update-cashbox.dto';

@Controller('cashboxs')
@UseGuards(JwtAuthGuard, PermissionsGuards)
@ApiTags('Cashboxs')
@ApiBearerAuth()
@ApiForbiddenResponse({
  description: 'Only user with the permissions can acces to this end points.',
})
export class CashboxsController {
  constructor(private readonly cashboxsService: CashboxsService) {}

  // ------------------------------------------------------------------------------------
  // CRATE CASHBOX
  // ------------------------------------------------------------------------------------
  @Post()
  @RequirePermissions(Permission.CREATE_NEW_CASHBOX)
  @ApiOperation({
    summary: 'Create New Cashbox',
    description: 'This end point create a new cashbox.',
  })
  @ApiCreatedResponse({
    description: 'The cashbox has been successfully create',
    type: NewCashboxDto,
  })
  create(@Body() createCashboxDto: CreateCashboxDto, @Req() req: Request) {
    return this.cashboxsService.create(createCashboxDto, req.user as User);
  }

  // ------------------------------------------------------------------------------------
  // GET ALL CASHBOX
  // ------------------------------------------------------------------------------------
  @Get()
  @RequirePermissions(Permission.READ_CASHBOX)
  @ApiOperation({
    summary: 'Get all cashbox',
    description: 'This end point return a cashbox list that user can access',
  })
  @ApiOkResponse({ description: 'Ok', type: [CashboxDto] })
  findAll(@Req() req: Request) {
    return this.cashboxsService.findAll(req.user as User);
  }

  // ------------------------------------------------------------------------------------
  // GET ONE CASHBOX
  // ------------------------------------------------------------------------------------
  @Get(':id')
  @RequirePermissions(Permission.READ_CASHBOX)
  @ApiOperation({ summary: 'Get cashbox by Id' })
  @ApiOkResponse({ type: CashboxWithAll })
  @ApiNotFoundResponse({
    description:
      'The searched box was not found or you do not have access to it',
  })
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.cashboxsService.findOne(id, req.user as User);
  }

  // ------------------------------------------------------------------------------------
  // UPDATE CASHBOX BY ID
  // ------------------------------------------------------------------------------------
  @Patch(':id')
  @RequirePermissions(Permission.UPDATE_CASHBOX)
  @ApiOperation({ summary: 'Update cashbox by Id' })
  @ApiOkResponse({ description: 'Ok', type: CashboxDto })
  @ApiNotFoundResponse({
    description:
      'The cashbox was not found or you do not have access to update',
  })
  update(
    @Param('id') id: string,
    @Body() updateCashboxDto: UpdateCashboxDto,
    @Req() req: Request
  ) {
    return this.cashboxsService.update(id, updateCashboxDto, req.user as User);
  }

  // ------------------------------------------------------------------------------------
  // DELETE CASHBOX BY ID
  // ------------------------------------------------------------------------------------
  @Delete(':id')
  @RequirePermissions(Permission.DELETE_CASHBOX)
  @ApiOkResponse({ description: 'Ok', type: CashboxDto })
  @ApiOperation({ summary: 'Delete cashbox by Id' })
  @ApiNotFoundResponse({
    description:
      'The cashbox was not found or you do not have access to deleted',
  })
  @ApiBadRequestResponse({ description: 'The box is open' })
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.cashboxsService.remove(id, req.user as User);
  }
}

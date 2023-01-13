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
import { ApiBearerAuth, ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuards } from '../auth/guards/permissions.guard';
import { User } from '../users/schema/user.schema';
import { CashboxsService } from './cashboxs.service';
import { CreateCashboxDto } from './dto/create-cashbox.dto';
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

  @Post()
  create(@Body() createCashboxDto: CreateCashboxDto, @Req() req: Request) {
    return this.cashboxsService.create(createCashboxDto, req.user as User);
  }

  @Get()
  findAll(@Req() req: Request) {
    return this.cashboxsService.findAll(req.user as User);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.cashboxsService.findOne(id, req.user as User);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCashboxDto: UpdateCashboxDto,
    @Req() req: Request
  ) {
    return this.cashboxsService.update(id, updateCashboxDto, req.user as User);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cashboxsService.remove(id);
  }
}

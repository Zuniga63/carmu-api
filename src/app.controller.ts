import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AppService } from './app.service';
import { RequirePermissions } from './modules/auth/decorators/required-permissions.decorator';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { PermissionsGuards } from './modules/auth/guards/permissions.guard';
import { Permission } from './modules/auth/permission.enum';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/config/install-cloudinary-presets')
  @UseGuards(JwtAuthGuard, PermissionsGuards)
  @RequirePermissions(Permission.INSTALL_CLOUD_PRESETS)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({
    description: 'Only admin can use this end point.',
  })
  @ApiForbiddenResponse({
    description: 'Only super admin can acces to this end point',
  })
  installPresets(): void {
    this.appService.installPressets();
  }
}

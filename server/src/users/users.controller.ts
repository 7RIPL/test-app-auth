import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getProfile(@Req() req: any) {
    const user = await this.usersService.findById(req.user.sub);
    if (!user) {
      return { id: null, login: null, email: null, displayName: null, registeredAt: null };
    }
    return {
      id: user.id,
      login: user.login,
      email: user.email,
      displayName: user.displayName,
      registeredAt: user.registeredAt,
    };
  }

  @Patch('me')
  async updateProfile(@Req() req: any, @Body() dto: UpdateProfileDto) {
    const updated = await this.usersService.updateProfile(req.user.sub, dto);
    return {
      id: updated.id,
      login: updated.login,
      email: updated.email,
      displayName: updated.displayName,
      registeredAt: updated.registeredAt,
    };
  }
}
import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { UpdateProfileDto } from '../auth/dto/update-profile.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('me')
    async getMyProfile(@CurrentUser() user: any) {
        return this.usersService.findById(user.id);
    }

    @Patch('me')
    async updateMyProfile(
        @CurrentUser() user: any,
        @Body() dto: UpdateProfileDto,
    ) {
        return this.usersService.updateProfile(user.id, dto);
    }
}
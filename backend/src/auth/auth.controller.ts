import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from "express";
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleLoginDto } from './dto/google-login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.register(dto);

    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: false, // deploy HTTPS thì đổi thành true
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return {
      user: result.user,
    };
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto);

    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: false,
      path: '/',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    // console.log('set-cookie header:', res.getHeader('Set-Cookie'));

    return {
      ok: true,
      user: result.user,
    };
  }

  // @Post('login')
  // async login(
  //   @Body() dto: LoginDto,
  //   @Res({ passthrough: true }) res: Response,
  // ) {
  //   const result = await this.authService.login(dto);

  //   res.cookie('access_token', result.accessToken, {
  //     httpOnly: true,
  //     secure: false, // deploy HTTPS thì đổi thành true
  //     sameSite: 'lax',
  //     maxAge: 1000 * 60 * 60 * 24 * 7,
  //   });

  //   return {
  //     user: result.user,
  //   };
  // }

  @Post('google')
  async googleLogin(
    @Body() dto: GoogleLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.googleLogin(dto.idToken);

    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: false,
      path: '/',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return {
      ok: true,
      user: result.user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: any) {
    return user;
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });

    return { message: 'Logged out successfully' };
  }
}
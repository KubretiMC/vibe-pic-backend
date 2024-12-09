import { Controller, Post, Body, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const token = await this.authService.validateUser(body.username, body.password);
    if (!token) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return { token };
  }

  @Post('register')
  async register(@Body() body: { username: string; password: string }) {
    try {
      const user = await this.authService.registerUser(body.username, body.password);
      return { message: 'Registration successful' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

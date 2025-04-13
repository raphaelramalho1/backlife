import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateCaregiverDto, LoginCaregiverDto } from '../dto/caregiver.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createCaregiverDto: CreateCaregiverDto) {
    return this.authService.register(createCaregiverDto);
  }

  @Post('login')
  async login(@Body() loginCaregiverDto: LoginCaregiverDto) {
    return this.authService.login(loginCaregiverDto);
  }
}

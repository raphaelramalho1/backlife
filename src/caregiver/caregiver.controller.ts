import { Body, Controller, Post } from '@nestjs/common';
import { CaregiverService } from './caregiver.service';
import { CreateCaregiverDto, LoginCaregiverDto } from '../dto/caregiver.dto';

@Controller('caregivers')
export class CaregiverController {
  constructor(private readonly caregiverService: CaregiverService) {}

  @Post('signup')
  async signup(@Body() createCaregiverDto: CreateCaregiverDto) {
    return this.caregiverService.create(createCaregiverDto);
  }

  @Post('login')
  async login(@Body() loginCaregiverDto: LoginCaregiverDto) {
    return this.caregiverService.login(loginCaregiverDto);
  }
}

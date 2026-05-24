import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login') login(@Body() dto: LoginDto) { return this.authService.login(dto); }
  @Post('refresh') refresh(@Body() body: { refreshToken?: string }) { return this.authService.refresh(body.refreshToken ?? ''); }
  @Post('password-reset/request') requestPasswordReset(@Body() body: { email?: string }) { return this.authService.requestPasswordReset(body.email ?? ''); }
  @Post('password-reset/confirm') resetPassword(@Body() body: { token: string; password: string }) { return this.authService.resetPassword(body); }
  @Post('2fa/enable') enableTwoFactor(@Body() body: { userId: string }) { return this.authService.enableTwoFactor(body.userId); }
  @Post('2fa/verify') verifyTwoFactor(@Body() body: { userId: string; code: string }) { return this.authService.verifyTwoFactor(body.userId, body.code); }
  @Get('device-history') deviceHistory() { return this.authService.deviceHistory(); }
}

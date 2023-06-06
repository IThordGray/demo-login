import { Body, ConflictException, Controller, HttpCode, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { getErrorMap, ILoginResult, IRegisterResponse } from 'backend/shared';
import { Request } from 'express';
import { RequestWithUser } from './auth/abstractions/request-with-user.type';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/guards/jwt.guard';
import { LocalAuthGuard } from './auth/guards/local.guard';
import { JwtRefreshAuthGuard } from './auth/guards/refresh-jwt.guard';
import { RegisterUserDto } from './shared/register-user.dto';

@Controller('auth')
export class AuthController {

  @Inject(AuthService) private readonly _authService!: AuthService;

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async loginAsync(@Req() req: RequestWithUser): Promise<ILoginResult> {
    return this._authService.loginAsync(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(200)
  async logoutAsync(@Req() req: RequestWithUser): Promise<void> {
    return this._authService.logoutAsync(req.user);
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  @HttpCode(200)
  async refreshAsync(@Req() req: RequestWithUser): Promise<ILoginResult> {
    return this._authService.refreshAsync(req.user);
  }

  @Post('register')
  async registerAsync(@Body() registerDto: RegisterUserDto): Promise<IRegisterResponse> {
    try {
      return await this._authService.registerAsync({
        email: registerDto.email,
        password: registerDto.password as string,
        firstName: registerDto.firstName as string,
        lastName: registerDto.lastName as string
      });
    } catch (error) {
      if (error instanceof ConflictException) throw new ConflictException(getErrorMap('User').conflictError);
      throw error;
    }
  }

  @Post('resetPassword')
  async resetPasswordAsync(@Body() { email }: { email: string }, @Req() req: Request): Promise<void> {
    const refererUrl = req.headers.origin as string;
    return this._authService.resetPasswordAsync(email, refererUrl);
  }

  @Post('setPassword')
  async setPasswordAsync(@Body() {
    userId,
    resetCode,
    password
  }: { userId: string, resetCode: string, password: string }): Promise<void> {
    return this._authService.setPasswordAsync(userId, resetCode, password);
  }
}

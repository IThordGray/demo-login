import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IRegisterResponse, LoginResult } from 'backend/shared';
import { IUser } from 'frontend/features/login';
import { AuthEmailService } from '../shared/auth-email.service';
import { BasicUserInfo, User } from '../users/abstractions/user.model';
import { hashAndCompareAsync } from '../users/password.helper';
import { UsersService } from '../users/users.service';
import { AES_256_CBC } from './abstractions/aes_256_cbc';
import { IResetCode } from './abstractions/reset-code.interface';

@Injectable()
export class AuthService {

  @Inject(UsersService) private readonly _usersService!: UsersService;
  @Inject(JwtService) private readonly _jwtService!: JwtService;
  @Inject(ConfigService) private readonly _configService!: ConfigService;
  @Inject(AuthEmailService) private readonly _emailService!: AuthEmailService;

  private getRefreshToken(user: User): string {
    const payload = { sub: user.id };
    return this._jwtService.sign(payload, {
      secret: `${ this._configService.get('JWT_REFRESH_TOKEN_SECRET') }`,
      expiresIn: `${ this._configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME') }s`
    });
  }

  private async setRefreshTokenAsync(id: string, refreshToken: string | null): Promise<void> {
    await this._usersService.setRefreshTokenAsync(id, refreshToken);
  }

  getAccessToken(user: User, expiresIn: number): string {
    const payload = { sub: user.id };
    return this._jwtService.sign(payload, {
      secret: `${ this._configService.get('JWT_ACCESS_TOKEN_SECRET') }`,
      expiresIn: `${ expiresIn }s`
    });
  }

  async loginAsync(user: User): Promise<LoginResult> {
    const accessTokenExpiresIn = Number(this._configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'));
    const accessToken = this.getAccessToken(user, accessTokenExpiresIn);
    const refreshToken = this.getRefreshToken(user);
    await this.setRefreshTokenAsync(user.id, refreshToken);

    return new LoginResult({ accessToken, expiresIn: accessTokenExpiresIn, refreshToken });
  }

  async logoutAsync(user: User): Promise<void> {
    await this.setRefreshTokenAsync(user.id, null);
  }

  async refreshAsync(user: User): Promise<LoginResult> {
    const accessTokenExpiresIn = Number(this._configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'));
    const accessToken = this.getAccessToken(user, accessTokenExpiresIn);
    return new LoginResult({ accessToken, expiresIn: accessTokenExpiresIn });
  }

  async registerAsync(createUserDto: BasicUserInfo & { password: string }): Promise<IRegisterResponse> {
    const user = await this._usersService.createAsync(createUserDto as User);
    return { userId: user.id };
  }

  async resetPasswordAsync(email: string, referer: string): Promise<void> {
    const user = await this._usersService.getByEmailAsync(email);
    if (!user) return;

    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 1);

    const resetCode = {
      email: user.email,
      expiry: expiry.getTime(),
      userId: user.id
    };


    // Todo: Store code.

    const encodedResetCode = Buffer.from(JSON.stringify(resetCode)).toString('base64');
    const encryptedResetCode = AES_256_CBC.encrypt(encodedResetCode);

    const resetLink = `${ referer }/auth/set-password?userId=${ user.id }&resetCode=${ encryptedResetCode }`;

    await this._emailService?.sendAsync(this._emailService.getResetPasswordEmail({ email, resetLink }));
  }

  async setPasswordAsync(userId: string, code: string, password: string): Promise<void> {
    const decryptedCode = AES_256_CBC.decrypt(code);
    const resetCode: IResetCode = JSON.parse(Buffer.from(decryptedCode, 'base64').toString());

    if (userId !== resetCode.userId) {
      const error = 'Password reset link invalid';
      throw new BadRequestException(error);
    }

    if (Date.now() > resetCode.expiry) {
      const error = 'Password reset link expiry exceeded';
      throw new BadRequestException(error);
    }

    const user = await this._usersService.getAsync(userId);

    const resetCodeSegment = code.slice(code.length - 16);

    if (user.resetCodeSegment === resetCodeSegment) {
      throw new BadRequestException('Password reset link invalid');
    }

    await this._usersService.updateAsync(userId, { ...user, password, resetCodeSegment });
    await this._emailService?.sendAsync(this._emailService.getSetPasswordEmail({ email: resetCode.email }));
  }

  async validateUserAsync(username: string, password: string): Promise<Omit<User, 'password'>> {
    const user = await this._usersService.getByEmailAsync(username).catch(() => undefined);

    if (!user || !(await hashAndCompareAsync(password, user?.password))) {
      throw new UnauthorizedException('Wrong credentials provided');
    }

    delete user.password;
    return user;
  }
}

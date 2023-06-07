import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { User } from '../../users/abstractions/user.model';
import { hashAndCompareAsync } from '../../users/password.helper';
import { UsersService } from '../../users/users.service';
import { IAccessToken } from '../abstractions/access-token.interface';

type UserWithoutPassword = Omit<User, 'password'>;

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {

  @Inject(UsersService) private readonly _userService!: UsersService;

  constructor(
    _configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refresh_token'),
      ignoreExpiration: false,
      secretOrKey: _configService.get('JWT_REFRESH_TOKEN_SECRET'),
      passReqToCallback: true
    });
  }

  async validate(request: Request, payload: IAccessToken): Promise<UserWithoutPassword> {
    const user: User = await this._userService.getAsync(payload.sub);
    if (!(await hashAndCompareAsync(request.body.refresh_token, user.refreshToken))) throw new UnauthorizedException('Token has expired');
    delete user.password;

    return user;
  }
}

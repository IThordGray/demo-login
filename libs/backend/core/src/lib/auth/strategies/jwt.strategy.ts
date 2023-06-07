import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../../users/abstractions/user.model';
import { UsersService } from '../../users/users.service';
import { IAccessToken } from '../abstractions/access-token.interface';

type UserWithoutPassword = Omit<User, 'password' | 'resetCodeSegment'>;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  @Inject(UsersService) private readonly _usersService!: UsersService;

  constructor(
    _configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: _configService.get('JWT_ACCESS_TOKEN_SECRET')
    });
  }

  async validate(payload: IAccessToken): Promise<{ id: string, email: string }> {
    const user: User = await this._usersService.getAsync(payload.sub);
    return { id: payload.sub, email: user.email };
  }
}

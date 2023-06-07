import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { User } from '../../users/abstractions/user.model';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {

  @Inject(AuthService) private readonly _authService!: AuthService;

  constructor() {
    super({ usernameField: 'email' });
  }

  async validate(username: string, password: string): Promise<Omit<User, 'password'>> {
    const user = await this._authService.validateUserAsync(username, password);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}

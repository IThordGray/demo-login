import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import { User } from '../../users/abstractions/user.model';
import { UsersService } from '../../users/users.service';

@Injectable()
export class GoogleOAuthStrategy extends PassportStrategy(Strategy, 'google') {
  @Inject(UsersService) private readonly _usersService!: UsersService;

  constructor(
    configService: ConfigService
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_CALLBACK_URL'),
      scope: [ 'email', 'profile' ]
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { name, email, photos } = profile;
    const { givenName: firstName, familyName: lastName } = name;

    let user = await this._usersService.getByEmailAsync(email);
    if (user) return done(null, user);

    user = { firstName, lastName, email } as User;
    return done(null, await this._usersService.createAsync(user));
  }
}

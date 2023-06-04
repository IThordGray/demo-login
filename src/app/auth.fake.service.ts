import { HttpParams } from '@angular/common/http';
import { AuthService, InvalidCredentialsError, IUser } from '@itg/login';


export class AuthFakeService implements AuthService {
  private readonly _users = new Map<string, IUser & { password?: string }>();

  private _resetCode?: string;

  accessToken?: string;
  user?: IUser;

  async loginAsync(username: string, password: string): Promise<void> {
    const user = Array.from(this._users.values()).find(x => x.email === username?.trim()?.toLowerCase() && x.password === password?.trim()?.toLowerCase());
    if (!user) throw new InvalidCredentialsError();

    delete user.password;
    this.user = user;
    this.accessToken = btoa(JSON.stringify(user));
  }

  async logoutAsync(): Promise<void> {
    this.accessToken = undefined;
    this.user = undefined;
  }

  async registerAsync(firstName: string, lastName: string, username: string, password: string): Promise<void> {
    const user: IUser & { password?: string } = {
      id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      firstName,
      lastName,
      email: username,
      password
    };

    this._users.set(user.id, user);
  }

  async resetPasswordAsync(username: string): Promise<void> {
    const user = Array.from(this._users.values()).find(x => x.email === username?.trim()?.toLowerCase());
    if (!user) {
      console.warn('Invalid username');
      return;
    }

    const resetCode = this._resetCode = 'abc';
    const params = new HttpParams({ fromObject: { userId: user.id, resetCode } });
    const url = `${ location.href }?${ params.toString() }`;
    console.log(url);
  }

  async setPasswordAsync(userId: string, resetCode: string, password: string): Promise<void> {
    if (this._resetCode !== resetCode) throw new Error('Invalid reset code');
    const user = this._users.get(userId);
    if (!user) throw new Error('Invalid user');
    user.password = password;
  }
}

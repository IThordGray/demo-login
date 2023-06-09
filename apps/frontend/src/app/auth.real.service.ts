import { inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, IUser } from 'frontend/features/login';
import { BehaviorSubject, Subject } from 'rxjs';
import { AuthApi } from './auth.api';
import { ILoginResult } from './login-result.interface';

export interface IJwt {
  sub: string,
  iat: number,
  exp: number
}

export function decodeJwt(token: string): IJwt {
  return JSON.parse(atob(token.split('.')[1]));
}

export function getTokenRefreshTimeInMs(token: IJwt | string, msToExpiry: number = 1000 * 60): number {
  const jwt: IJwt = typeof token === 'string' ? decodeJwt(token) : token;
  return (jwt.exp * 1000) - Date.now() - msToExpiry;
}

export class AuthRealService implements AuthService {

  private readonly _authApi = inject(AuthApi);
  private readonly _router = inject(Router);
  private readonly _activatedRoute = inject(ActivatedRoute);

  private _refreshTokenTimer: number | undefined;

  readonly silentlyRefreshed$ = new Subject<void>();
  readonly isAuthenticated$ = new BehaviorSubject<boolean>(false);

  accessToken?: string;
  user?: IUser;

  constructor() {
    this.checkExistingTokenAsync();

    this.silentlyRefreshed$.subscribe(() => {
      this.refreshAsync();
    });
  }

  private async doLoginAsync(loginResult: ILoginResult): Promise<void> {
    localStorage.setItem('accessToken', loginResult.accessToken);
    localStorage.setItem('refreshToken', loginResult.refreshToken!);

    this.startRefreshTokenTimer(getTokenRefreshTimeInMs(loginResult.accessToken));

    this.setTokens(loginResult);
    const redirectUrl = this._router.parseUrl(this._activatedRoute.snapshot.queryParamMap.get('redirectUrl') ?? '/');
    await this._router.navigateByUrl(redirectUrl);
    alert('Login successful');
  }

  private setTokens(loginResponse: ILoginResult): void {
    this.accessToken = loginResponse.accessToken;
    const jwt: IJwt & { userInfo?: IUser } = decodeJwt(loginResponse.accessToken);
    this.isAuthenticated$.next(true);
    this.user = {
      id: jwt.sub,
      email: jwt.userInfo?.email as string,
      firstName: jwt.userInfo?.firstName as string,
      lastName: jwt.userInfo?.lastName as string
    };
  }

  private startRefreshTokenTimer(ms: number): void {
    window.clearTimeout(this._refreshTokenTimer);

    this._refreshTokenTimer = window.setTimeout(() => this.refreshAsync(), ms);
  }

  /**
   * Checks whether there is a valid access token in local storage.
   * Depending on the url and the tokens, the user is redirected to the correct page.
   */
  async checkExistingTokenAsync() {
    function clearStorage(): void {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }

    if (location.pathname.includes('/auth/register') && location.href.includes('?d=')) {
      clearStorage();
      return;
    }

    if (location.pathname.includes('/auth/setPassword') && location.href.includes('?resetCode=')) return;
    if (location.pathname.includes('/auth')) return this._router.navigateByUrl('');

    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!accessToken || !refreshToken) {
      console.warn('No access token or refresh token found');
      clearStorage();
    }

    const jwt = decodeJwt(accessToken!);
    if (new Date(jwt.exp * 1000).getTime() - Date.now() < 60000) {
      console.warn('Access token has expired');
      clearStorage();
    }

    const loginResponse: ILoginResult = {
      accessToken: accessToken as string,
      refreshToken: refreshToken as string,
      expiresIn: undefined
    };

    console.log('Existing access token is valid');
    this.startRefreshTokenTimer(getTokenRefreshTimeInMs(loginResponse.accessToken));
    this.setTokens(loginResponse);
  }

  async loginAsync(username: string, password: string): Promise<void> {
    try {
      const loginResult = await this._authApi.loginAsync(username, password);
      await this.doLoginAsync(loginResult);
    } catch (e) {
      console.warn(e);
      this._router.navigateByUrl('/auth/login');
    }
  }

  async loginWithGoogleAsync(): Promise<void> {
    try {
      const loginResult = await this._authApi.loginWithGoogleAsync();
      await this.doLoginAsync(loginResult);
    } catch (e) {
      console.warn(e);
      this._router.navigateByUrl('/auth/login');
    }
  }

  async logoutAsync(): Promise<void> {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    await this._router.navigateByUrl('/auth/login');
  }

  async refreshAsync(): Promise<void> {
    const refreshToken = localStorage.get('refreshToken');
    const response = await this._authApi.refreshAsync(refreshToken);

    localStorage.setItem('accessToken', response.accessToken);

    this.silentlyRefreshed$.next();
    this.startRefreshTokenTimer(getTokenRefreshTimeInMs(response.accessToken));
  }

  async registerAsync(firstName: string, lastName: string, username: string, password: string): Promise<void> {
    await this._authApi.registerAsync(firstName, lastName, username, password);
    await this._router.navigateByUrl('/auth/login');
    alert('Registration successful');
  }

  async registerWithGoogleAsync(): Promise<void> {
    await this._authApi.registerWithGoogleAsync();
    await this._router.navigateByUrl('/auth/login');
    alert('Registration successful');
  }
  async resetPasswordAsync(username: string): Promise<void> {
    await this._authApi.resetPasswordAsync(username);
    alert('Check your email for a reset code');
  }

  async setPasswordAsync(userId: string, resetCode: string, password: string): Promise<void> {
    await this._authApi.setPasswordAsync(userId, resetCode, password);
    await this._router.navigateByUrl('/auth/login');
    alert('Password reset successfully');
  }
}

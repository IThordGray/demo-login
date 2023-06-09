import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CONFIG } from './config.injection-token';
import { ILoginResult } from './login-result.interface';
import { IRegisterResponse } from './register-result.interface';

@Injectable()
export class AuthApi {
  private readonly _httpClient = inject(HttpClient);
  private readonly _apiUrl = inject(CONFIG).apiUrl as string;

  constructor() {
    this._httpClient.get(this._apiUrl);
    console.log(this._apiUrl);
  }

  async loginAsync(username: string, password: string): Promise<ILoginResult> {
    const url = `${ this._apiUrl }/auth/login`;

    return firstValueFrom(this._httpClient.post<ILoginResult>(url, { email: username, password }));
  }

  async loginWithGoogleAsync(): Promise<ILoginResult> {
    const url = `${ this._apiUrl }/auth/login/google`;

    return firstValueFrom(this._httpClient.get<ILoginResult>(url));
  }

  async refreshAsync(refreshToken: string): Promise<ILoginResult> {
    const url = `${ this._apiUrl }/auth/refresh`;

    return firstValueFrom(this._httpClient.post<ILoginResult>(url, { refresh_token: refreshToken }));
  }

  async registerAsync(firstName: string, lastName: string, username: string, password: string): Promise<IRegisterResponse> {
    const url = `${ this._apiUrl }/auth/register`;

    return firstValueFrom(this._httpClient.post<IRegisterResponse>(url, {
      email: username,
      password,
      firstName,
      lastName
    }));
  }

  async registerWithGoogleAsync(): Promise<IRegisterResponse> {
    const url = `${ this._apiUrl }/auth/register/google`;

    return firstValueFrom(this._httpClient.get<IRegisterResponse>(url));
  }

  async resetPasswordAsync(email: string): Promise<void> {
    const url = `${ this._apiUrl }/auth/resetPassword`;

    return firstValueFrom(this._httpClient.post<void>(url, { email }));
  }

  async setPasswordAsync(userId: string, resetCode: string, password: string): Promise<void> {
    const url = `${ this._apiUrl }/auth/setPassword`;

    return firstValueFrom(this._httpClient.post<void>(url, { userId, resetCode, password }));
  }
}

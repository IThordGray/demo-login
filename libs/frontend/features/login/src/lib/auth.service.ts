export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid username or password');
  }
}

export abstract class AuthService {
  accessToken?: string;
  user?: IUser;

  abstract loginAsync(username: string, password: string): Promise<void>;

  abstract logoutAsync(): Promise<void>;

  abstract registerAsync(
    firstName: string,
    lastName: string,
    username: string,
    password: string
  ): Promise<void>;

  abstract resetPasswordAsync(username: string): Promise<void>;

  abstract setPasswordAsync(
    userId: string,
    resetCode: string,
    password: string
  ): Promise<void>;
}

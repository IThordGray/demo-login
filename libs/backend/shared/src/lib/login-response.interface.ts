export interface ILoginResult {
  accessToken: string;
  expiresIn?: number;
  refreshToken?: string;
}

export class LoginResult {
  tokenType = 'bearer';

  public accessToken!: string;

  public expiresIn?: number;

  public refreshToken?: string;

  constructor(args: Omit<LoginResult, 'tokenType'>) {
    Object.assign(this, args);
  }
}

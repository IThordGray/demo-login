export interface BasicUserInfo {
  firstName: string;
  lastName: string;
  email: string;
}

export class User implements BasicUserInfo {
  id!: string;
  firstName!: string;
  lastName!: string;
  email!: string;
  password?: string;
  refreshToken?: string | null;
  resetCodeSegment?: string;
}


import { AuthEmailService, Email } from 'backend/core';

export class AuthEmailSendGridService implements AuthEmailService {
  getResetPasswordEmail(args: { email: string; resetLink: string }): Email {
    throw new Error('Method not implemented.');
  }

  getSetPasswordEmail(args: { email: string }): Email {
    throw new Error('Method not implemented.');
  }

  sendAsync(email: Email): Promise<void> {
    throw new Error('Method not implemented.');
  }

}

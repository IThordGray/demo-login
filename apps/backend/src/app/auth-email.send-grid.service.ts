import { AuthEmailService, Email } from 'backend/core';

export class AuthEmailSendGridService implements AuthEmailService {
  getResetPasswordEmail(args: { email: string; resetLink: string }): Email {
    return new Email();
  }

  getSetPasswordEmail(args: { email: string }): Email {
    return new Email();
  }

  sendAsync(email: Email): Promise<void> {
    return Promise.resolve(undefined);
  }

}

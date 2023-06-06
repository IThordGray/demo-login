export class Email {
  to!: string[];
  from!: string;
  cc?: string[];
  bcc?: string[];
  html!: string;
  subject?: string;
}

export abstract class AuthEmailService {
  abstract getResetPasswordEmail(args: { email: string, resetLink: string }): Email;

  abstract getSetPasswordEmail(args: { email: string }): Email;

  abstract sendAsync(email: Email): Promise<void>;
}

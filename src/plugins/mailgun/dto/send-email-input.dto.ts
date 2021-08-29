export class SendEmailInput {
  readonly from: string;

  readonly to: string | string[];

  readonly subject: string;

  readonly html: string;

  readonly text?: string;

  readonly template?: string;

  readonly attachment?;
}

export class SendEmailInput {
  readonly from: string;

  readonly to: string | string[];

  readonly subject: string;

  readonly text?: string;

  readonly html?: string;

  readonly template?: string;

  readonly attachment?;
}
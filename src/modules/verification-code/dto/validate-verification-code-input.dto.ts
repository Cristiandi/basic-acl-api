import { VerificationCodeType } from '../verfication-code.entity';
export class validateVerificationCodeInput {
  readonly code: string;

  readonly type?: VerificationCodeType;
}

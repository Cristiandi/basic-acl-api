import { VerificationCodeType } from '../verfication-code.entity';
import { User } from '../../user/user.entity';

export class CreateVerificationCodeInput {
  readonly expirationDate: Date;

  readonly type: VerificationCodeType;

  readonly user: User;
}

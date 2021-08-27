import { Role } from '../../role/role.entity';
import { User } from '../../user/user.entity';

export class CreateAssignedRoleInput {
  readonly role: Role;

  readonly user: User;
}

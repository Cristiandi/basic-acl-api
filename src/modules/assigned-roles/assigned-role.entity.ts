import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { ApiKey } from '../api-keys/api-key.entity';
import { Role } from '../roles/role.entity';
import { User } from '../users/user.entitty';

@Entity({ name: 'assigned_roles' })
export class AssignedRole {
  @PrimaryGeneratedColumn()
  id: number;
  
  @ManyToOne(type => User, user => user.assignedRoles, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(type => Role, role => role.assignedRoles)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToOne(type => ApiKey, apiKey => apiKey.assignedRoles, { nullable: true })
  @JoinColumn({ name: 'api_key_id' })
  apiKey: ApiKey;
}
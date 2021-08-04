import { ApiProperty } from '@nestjs/swagger';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { ApiKey } from '../api-keys/api-key.entity';
import { Role } from '../roles/role.entity';
import { User } from '../users/user.entity';

@Entity({ name: 'assigned_roles' })
export class AssignedRole {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;
  
  @ApiProperty({ type: () => User })
  @ManyToOne(type => User, user => user.assignedRoles, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({ type: () => Role })
  @ManyToOne(type => Role, role => role.assignedRoles)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ApiProperty({ type: () => ApiKey })
  @ManyToOne(type => ApiKey, apiKey => apiKey.assignedRoles, { nullable: true })
  @JoinColumn({ name: 'api_key_id' })
  apiKey: ApiKey;
}
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AssignedRole } from './assigned-role.entity';

import { ApiKeysService } from '../api-keys/api-keys.service';
import { RolesService } from '../roles/roles.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AssignedRolesService {
  constructor(
    @InjectRepository(AssignedRole)
    private readonly assignedRoleRepository: Repository<AssignedRole>,
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
    private readonly apiKeysService: ApiKeysService
  ) {}
}

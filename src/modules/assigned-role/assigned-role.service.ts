import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseService } from '../../common/base.service';
import { RoleService } from '../role/role.service';
import { UserService } from '../user/services/user.service';

import { AssignedRole } from './assigned-role.entity';

import { CreateAssignedRoleInput } from './dto/create-assigned-role-input.dto';
import { GetAllAssignedRolesInput } from './dto/get-all-assigned-roles-input.dto';
import { getUserRolesInput } from './dto/get-user-roles-input.dto';

@Injectable()
export class AssignedRoleService extends BaseService<AssignedRole> {
  constructor(
    @InjectRepository(AssignedRole)
    private readonly assignedRoleRepository: Repository<AssignedRole>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly roleService: RoleService,
  ) {
    super(assignedRoleRepository);
  }

  public async create(input: CreateAssignedRoleInput): Promise<AssignedRole> {
    const { roleUid, userUid } = input;

    // get the exisiting role
    const role = await this.roleService.getOneByOneFields({
      fields: { uid: roleUid },
      checkIfExists: true,
    });

    // get the exisiting user
    const user = await this.userService.getOneByOneFields({
      fields: { authUid: userUid },
      checkIfExists: true,
    });

    // get the exisiting one
    const existing = await this.getOneByOneFields({
      fields: { role, user },
    });

    // check if it exists and if it does, throw a conflict exeption
    if (existing) {
      throw new ConflictException('assigned role already exists.');
    }

    // create the new one
    const created = this.assignedRoleRepository.create({
      role,
      user,
    });

    // save the created one
    const saved = await this.assignedRoleRepository.save(created);

    return saved;
  }

  public async getAll(
    input: GetAllAssignedRolesInput,
  ): Promise<AssignedRole[]> {
    const { companyUid, limit, skip, q } = input;

    const query = this.assignedRoleRepository
      .createQueryBuilder('assignedRole')
      .loadAllRelationIds()
      .innerJoin('assignedRole.user', 'user')
      .innerJoin('assignedRole.role', 'role')
      .innerJoin('user.company', 'company')
      .where('company.uid = :companyUid', { companyUid });

    if (q)
      query.andWhere(
        'user.email ilike :q OR user.phone ilike :q OR role.code ilike :q OR role.name ilike :q',
        {
          q: `%${q}%`,
        },
      );

    query.limit(limit || 10).skip(skip);

    const items = await query.getMany();

    return items;
  }

  public async delete(input: CreateAssignedRoleInput): Promise<AssignedRole> {
    const { roleUid, userUid } = input;

    // get the exisiting role
    const role = await this.roleService.getOneByOneFields({
      fields: { uid: roleUid },
      checkIfExists: true,
    });

    // get the exisiting user
    const user = await this.userService.getOneByOneFields({
      fields: { authUid: userUid },
      checkIfExists: true,
    });

    // get the exisiting one
    const existing = await this.getOneByOneFields({
      fields: { role, user },
      checkIfExists: true,
    });

    // create a clone of the existing one
    const clone = { ...existing };

    // remove the existing one from the database
    await this.assignedRoleRepository.remove(existing);

    // return the clone as the existing one
    return clone as AssignedRole;
  }

  public async getUserRoles(input: getUserRolesInput): Promise<AssignedRole[]> {
    const { userUid } = input;

    const assignedRoles = await this.assignedRoleRepository
      .createQueryBuilder('assignedRole')
      .innerJoinAndSelect('assignedRole.role', 'role')
      .innerJoinAndSelect('assignedRole.user', 'user')
      .where('user.uid = :userUid', { userUid })
      .getMany();

    return assignedRoles;
  }
}

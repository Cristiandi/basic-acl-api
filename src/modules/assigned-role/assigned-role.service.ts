import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseService } from '../../common/base.service';

import { AssignedRole } from './assigned-role.entity';

import { CreateAssignedRoleInput } from './dto/create-assigned-role-input.dto';

@Injectable()
export class AssignedRoleService extends BaseService<AssignedRole> {
  constructor(
    @InjectRepository(AssignedRole)
    private readonly assignedRoleRepository: Repository<AssignedRole>,
  ) {
    super(assignedRoleRepository);
  }

  public async create(input: CreateAssignedRoleInput): Promise<AssignedRole> {
    const { role, user } = input;

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

  public async delete(input: CreateAssignedRoleInput): Promise<AssignedRole> {
    const { role, user } = input;

    // get the exisiting one
    const existing = await this.getOneByOneFields({
      fields: { role, user },
      checkIfExists: true,
    });

    // create a clone of the existing one
    const clone = { ...existing };

    // remove the existing one from the database
    await this.assignedRoleRepository.softRemove(existing);

    // return the clone as the existing one
    return clone as AssignedRole;
  }
}

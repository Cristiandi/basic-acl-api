import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { BaseService } from '../../common/base.service';
import { CompanyService } from '../company/services/company.service';

import { Role } from './role.entity';

import { CreateRoleInput } from './dto/create-role-input.dto';
import { GetOneRoleInput } from './dto/get-one-role-input.dto';
import { GetAllRolesInput } from './dto/get-all-role-input.dto';
import { UpdateRoleInput } from './dto/update-role-input.dto';

@Injectable()
export class RoleService extends BaseService<Role> {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly companyService: CompanyService,
  ) {
    super(roleRepository);
  }

  // CRUD

  public async create(input: CreateRoleInput): Promise<Role> {
    const { companyUid } = input;

    const company = await this.companyService.getOne({
      uid: companyUid,
    });

    if (!company) {
      throw new NotFoundException(`company with uid ${companyUid} not found.`);
    }

    const { code } = input;

    const existing = await this.getOneByOneFields({
      fields: { company, code },
    });

    if (existing) {
      throw new ConflictException(`role with code ${code} already exists.`);
    }

    const created = this.roleRepository.create({
      ...input,
      company,
    });

    const saved = await this.roleRepository.save(created);

    return saved;
  }

  public async getOne(input: GetOneRoleInput): Promise<Role | undefined> {
    const { uid } = input;

    const existing = await this.getOneByOneFields({
      fields: { uid },
      checkIfExists: false,
    });

    return existing;
  }

  public async getAll(input: GetAllRolesInput): Promise<Role[]> {
    const { companyUid, limit, skip, q } = input;

    const query = this.roleRepository
      .createQueryBuilder('role')
      .loadAllRelationIds()
      .innerJoin('role.company', 'company')
      .where('company.uid = :companyUid', { companyUid });

    if (q)
      query.andWhere(
        'role.code ilike :q OR role.name ilike :q OR role.description ilike :q',
        {
          q: `%${q}%`,
        },
      );

    query.limit(limit || 10).skip(skip);

    const items = await query.getMany();

    return items;
  }

  public async update(
    getOneRoleInput: GetOneRoleInput,
    input: UpdateRoleInput,
  ): Promise<Role> {
    const { uid } = getOneRoleInput;

    const existing = await this.getOneByOneFields({
      fields: { uid },
      checkIfExists: true,
    });

    const preloaded = await this.roleRepository.preload({
      id: existing.id,
      ...input,
    });

    const saved = await this.roleRepository.save(preloaded);

    return {
      ...existing,
      ...saved,
    } as Role;
  }

  public async delete(input: GetOneRoleInput): Promise<Role> {
    const { uid } = input;

    const existing = await this.getOneByOneFields({
      fields: { uid },
      checkIfExists: true,
    });

    const clone = { ...existing };

    await this.roleRepository.softRemove(existing);

    return clone as Role;
  }

  // CRUD

  public getByIds(ids: number[]): Promise<Role[]> {
    return this.roleRepository.find({
      where: {
        id: In(ids),
      },
      loadRelationIds: true,
    });
  }
}

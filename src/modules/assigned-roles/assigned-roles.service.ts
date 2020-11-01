import { forwardRef, HttpException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AssignedRole } from './assigned-role.entity';

import { ApiKeysService } from '../api-keys/api-keys.service';
import { RolesService } from '../roles/roles.service';
import { UsersService } from '../users/users.service';

import { CreateAssignedRoleInput } from './dto/create-assigned-role-input.dto';
import { FindAllAssignedRolesParamInput } from './dto/find-all-assigned-roles-param-input.dto';
import { FindAllAssignedRolesQueryInput } from './dto/find-alll-assigned-roles-query-input.dto';
import { FindOneAssignedRoleInput } from './dto/find-one-assigned-role-input.dto';
import { AssignInput } from './dto/assign-input.dto';

@Injectable()
export class AssignedRolesService {
  constructor(
    @InjectRepository(AssignedRole)
    private readonly assignedRoleRepository: Repository<AssignedRole>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
    private readonly apiKeysService: ApiKeysService
  ) {}

  /**
   * function to create
   *
   * @param {CreateAssignedRoleInput} createAssignedRoleInput
   * @return {*}  {Promise<AssignedRole>}
   * @memberof AssignedRolesService
   */
  public async create(createAssignedRoleInput: CreateAssignedRoleInput): Promise<AssignedRole> {
    const { companyUuid, roleId } = createAssignedRoleInput;

    const role = await this.rolesService.findOne({ companyUuid, id: `${roleId}` });
    delete role.company;

    const { userId, apiKeyId } = createAssignedRoleInput;

    if (userId && apiKeyId) {
      throw new HttpException('can not send userId and apiKeyId at the same time.', 412);
    }

    if (!userId && !apiKeyId) {
      throw new HttpException('send at least userId or apikeyId.', 412);
    }

    let user;
    if (userId) {
      user = await this.usersService.findOne({ companyUuid, id: `${userId}` });
      delete user.company;
    }

    let apiKey;
    if (apiKeyId) {
      apiKey = await this.apiKeysService.findOne({ companyUuid, id: `${apiKeyId}` });
      delete apiKey.company;
    }

    const compareTo = await this.assignedRoleRepository.find({
      select: ['id'],
      where: {
        role,
        user: user || null,
        apiKey: apiKey || null
      }
    });

    if (compareTo.length) {
      throw new HttpException(`already exists the assigned role ${role.id} for user ${userId} or api key ${apiKeyId}`, 412);
    }   

    const created = this.assignedRoleRepository.create({
      role,
      user,
      apiKey
    });

    return this.assignedRoleRepository.save(created);
  }

  /**
   * function to find all
   *
   * @param {FindAllAssignedRolesParamInput} findAllAssignedRolesParamInput
   * @param {FindAllAssignedRolesQueryInput} findAllAssignedRolesQueryInput
   * @return {*}  {Promise<AssignedRole[]>}
   * @memberof AssignedRolesService
   */
  public async findAll(
    findAllAssignedRolesParamInput: FindAllAssignedRolesParamInput,
    findAllAssignedRolesQueryInput: FindAllAssignedRolesQueryInput
  ): Promise<AssignedRole[]> {
    const { limit = 0, offset = 0 } = findAllAssignedRolesQueryInput;
    const { companyUuid } = findAllAssignedRolesParamInput;

    const data = await this.assignedRoleRepository.createQueryBuilder('ar')
      .select([
        'ar.id as id',
        'r.id as "roleId"',
        'r.code as "roleCode"',
        'u.id as "userId"',
        'u.email as "userEmail"',
        'ak.id as "apikeyId"',
        'ak.value as "apikeyValue"'
      ])
      .innerJoin('ar.role', 'r')
      .innerJoin('r.company', 'c')
      .leftJoin('ar.user', 'u')
      .leftJoin('ar.apiKey', 'ak')
      .where('c.uuid = :companyUuid', { companyUuid })
      .take(limit || undefined)
      .skip(offset)
      .execute();

    return data;
  }

  /**
   * function to find one or fail
   *
   * @param {FindOneAssignedRoleInput} findOneAssignedRoleInput
   * @return {*}  {Promise<AssignedRole>}
   * @memberof AssignedRolesService
   */
  public async findOne(findOneAssignedRoleInput: FindOneAssignedRoleInput): Promise<AssignedRole> {
    const { companyUuid, id } = findOneAssignedRoleInput;

    const existing = await this.assignedRoleRepository.createQueryBuilder('ar')
      .select(['ar.id', 'ar.role'])
      .innerJoinAndSelect('ar.role', 'r')
      .innerJoin('r.company', 'c')
      .leftJoinAndSelect('ar.user', 'u')
      .leftJoinAndSelect('ar.apiKey', 'ak')
      .where('c.uuid = :companyUuid', { companyUuid })
      .andWhere('ar.id = :id', { id })
      .getOne();

    if (!existing) {
      throw new NotFoundException(`can not get the assigned role ${id} for the company with uuid ${companyUuid}`);
    }

    return existing;
  }

  /**
   * function to remove one
   *
   * @param {FindOneAssignedRoleInput} findOneAssignedRoleInput
   * @return {*}  {Promise<AssignedRole>}
   * @memberof AssignedRolesService
   */
  public async remove(findOneAssignedRoleInput: FindOneAssignedRoleInput): Promise<AssignedRole> {
    const existing = await this.findOne(findOneAssignedRoleInput);

    const removed = await this.assignedRoleRepository.remove(existing);

    return removed;
  }

  /**
   *
   *
   * @param {AssignInput} assignInput
   * @return {*}  {Promise<AssignedRole>}
   * @memberof AssignedRolesService
   */
  public async assign(assignInput: AssignInput): Promise<AssignedRole> {
    const { companyUuid, userEmail } = assignInput;

    const user = await this.usersService.getCompanyUserByEmail({ companyUuid, email: userEmail });

    if (!user) {
      throw new NotFoundException(`can't get the user with email ${userEmail} for the company ${companyUuid}.`);
    }

    const { roleCode } = assignInput;

    const role = await this.rolesService.getCompanyRoleByCode({ companyUuid, code: roleCode });

    if (!role) {
      throw new NotFoundException(`cant get the role with code ${roleCode} for the company ${companyUuid}.`);
    }

    const createdAssignedRole = await this.create({ companyUuid, roleId: role.id, userId: user.id });

    return createdAssignedRole;
  }
}

import { UsePipes, ValidationPipe } from '@nestjs/common';
import {
  Args,
  Mutation,
  Resolver,
  Query,
  ResolveField,
  Parent,
} from '@nestjs/graphql';

import { User } from './user.entity';
import { Company } from '../company/company.entity';

import { UserService } from './user.service';
import { UserLoaders } from './user.loaders';

import { CreateUserInput } from './dto/create-user-input.dto';
import { GetOneUserInput } from './dto/get-one-user-input.dto';
import { GetAllUsersInput } from './dto/get-all-users-input.dto';

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly service: UserService,
    private readonly loaders: UserLoaders,
  ) {}

  @Mutation(() => User, { name: 'createUser' })
  public create(
    @Args('createUserInput') input: CreateUserInput,
  ): Promise<User> {
    return this.service.create(input);
  }

  @Query(() => User, { name: 'getOneUser', nullable: true })
  public getOne(
    @Args('getOneUserInput') input: GetOneUserInput,
  ): Promise<User | undefined> {
    return this.service.getOne(input);
  }

  @Query(() => [User], { name: 'getAllUsers' })
  public getAll(
    @Args('getAllUsersInput') input: GetAllUsersInput,
  ): Promise<User[]> {
    return this.service.getAll(input);
  }

  @Mutation(() => User, { name: 'deleteUser' })
  public delete(
    @Args('getOneUserInput') input: GetOneUserInput,
  ): Promise<User> {
    return this.service.delete(input);
  }

  @ResolveField(() => Company, { name: 'company' })
  company(@Parent() parent: User): Promise<Company> {
    const value: any = parent.company;

    let id = value;

    if (typeof id !== 'number') id = value.id;

    return this.loaders.batchCompanies.load(id);
  }
}

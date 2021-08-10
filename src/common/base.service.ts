import { NotFoundException } from '@nestjs/common';
import { BaseEntity, Entity, Repository } from 'typeorm';

import { GetOneByOneFieldInput } from './dto/get-one-input.dto';

export class BaseService<Entity extends BaseEntity> {
  constructor(private readonly repository: Repository<Entity>) {}

  public async getOneByOneFields(
    input: GetOneByOneFieldInput,
  ): Promise<Entity | undefined> {
    const { fields, relations, checkIfExists = false } = input;

    const existing = await this.repository.findOne({
      where: { ...fields },
      relations,
    });

    if (!existing && checkIfExists) {
      const values = Object.keys(fields)
        .map((key) => `${key} -> ${values[key]}`)
        .join(' | ');

      throw new NotFoundException(
        `can't get the ${Entity.name} with the values ${values}.`,
      );
    }

    return existing || undefined;
  }
}

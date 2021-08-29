import { NotFoundException } from '@nestjs/common';
import { BaseEntity, Repository } from 'typeorm';

import { GetOneByOneFieldInput } from './dto/get-one-input.dto';

export class BaseService<Entity extends BaseEntity> {
  constructor(private readonly repository: Repository<Entity>) {}

  public async getOneByOneFields(
    input: GetOneByOneFieldInput,
  ): Promise<Entity | undefined> {
    const { fields, relations, checkIfExists = false } = input;

    const existing = await this.repository.findOne({
      loadRelationIds: relations && !relations.length ? true : false,
      where: { ...fields },
      relations,
    });

    if (!existing && checkIfExists) {
      const values = Object.keys(fields)
        .map(
          (key) =>
            `${key} = ${
              typeof fields[key] === 'object' && fields[key]
                ? fields[key].id
                : fields[key]
            }`,
        )
        .join(' | ');

      throw new NotFoundException(
        `can't get the ${this.repository.metadata.tableName} with the values: ${values}.`,
      );
    }

    return existing || undefined;
  }
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Permission } from '../permisssions/permission.entity';
import { Project } from '../projects/project.entity';

@Entity({ name: 'graphql_actions' })
export class GraphqlAction {
  @ApiPropertyOptional()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 200 })
  name: string;

  @ApiProperty()
  @Column({ name: 'is_query', type: 'boolean', default: false })
  isQuery: boolean;

  @ApiProperty()
  @Column({ name: 'is_mutation', type: 'boolean', default: false })
  isMutation: boolean;

  // relations

  @ApiProperty({  type: () => [Project] })
  @ManyToOne(type => Project, project => project.graphqlActions)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ApiProperty({ type: () => [Permission] })
  @OneToMany(type => Permission, permission => permission.graphqlAction)
  permissions: Permission[];
}
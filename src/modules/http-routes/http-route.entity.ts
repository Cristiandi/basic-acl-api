import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

import { Permission } from '../permisssions/permission.entity';

import { Project } from '../projects/project.entity';

@Entity({ name: 'http_routes' })
@Unique('uk_http_routes', ['method', 'path', 'project'])
export class HttpRoute {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 100, nullable: true })
  name: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 6 })
  method: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 200 })
  path: string;

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // relations
  @ApiProperty({ type: () => Project })
  @ManyToOne(type => Project, project => project.httpRoutes)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ApiProperty({ type: () => [Permission] })
  @OneToMany(type => Permission, permission => permission.httpRoute)
  permissions: Permission[];
}
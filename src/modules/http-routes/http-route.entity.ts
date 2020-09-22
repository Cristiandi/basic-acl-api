import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

import { Project } from '../projects/project.entity';

@Entity({ name: 'http_routes' })
@Unique('uk_http_routes', ['method', 'path', 'project'])
export class HttpRoute {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 6 })
  method: string;

  @Column({ type: 'varchar', length: 200 })
  path: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // relations

  @ManyToOne(type => Project, project => project.httpRoutes)
  @JoinColumn({ name: 'project_id' })
  project: Project;
}
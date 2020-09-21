import { Column, CreateDateColumn, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Project } from '../projects/project.entity';

export class HttpRoute {
  @PrimaryGeneratedColumn()
  id: number;

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
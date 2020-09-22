import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

import { Company } from '../companies/company.entity';
import { HttpRoute } from '../http-routes/http-route.entity';

@Entity({ name: 'projects' })
@Unique('uk_projects', ['code', 'company'])
export class Project {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'varchar', length: 5 })
    code: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    // relations

    @ManyToOne(type => Company, company => company.projects)
    @JoinColumn({ name: 'company_id' })
    company: Company;

    @OneToMany(type => HttpRoute, httpRoute => httpRoute.project)
    httpRoutes: HttpRoute[]
}
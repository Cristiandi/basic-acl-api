import { company } from 'faker';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

import { Company } from '../companies/company.entity';


@Entity({ name: 'roles' })
@Unique('uk_projects', ['code', 'company'])
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 5 })
    code: string;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    // relations

    @ManyToOne(type => Company, company => company.roles)
    @JoinColumn({ name: 'company_id' })
    company: Company;
}
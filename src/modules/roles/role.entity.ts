import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

import { Company } from '../companies/company.entity';
import { AssignedRole } from '../assigned-roles/assigned-role.entity';

@Entity({ name: 'roles' })
@Unique('uk_roles', ['code', 'company'])
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

    @OneToMany(type => AssignedRole, assignedRole => assignedRole.role)
    assignedRoles: AssignedRole[];
}
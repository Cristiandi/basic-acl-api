import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

import { Company } from '../companies/company.entity';
import { AssignedRole } from '../assigned-roles/assigned-role.entity';
import { Permission } from '../permisssions/permission.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'roles' })
@Unique('uk_roles', ['code', 'company'])
export class Role {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column({ type: 'varchar', length: 5 })
    code: string;

    @ApiProperty()
    @Column({ type: 'varchar', length: 100 })
    name: string;

    @ApiProperty()
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
    
    @ApiProperty()
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    // relations

    @ApiProperty({ type: () => Company })
    @ManyToOne(type => Company, company => company.roles)
    @JoinColumn({ name: 'company_id' })
    company: Company;

    @ApiProperty({ type: () => [AssignedRole] })
    @OneToMany(type => AssignedRole, assignedRole => assignedRole.role)
    assignedRoles: AssignedRole[];

    @ApiProperty({ type: () => [Permission] })
    @OneToMany(type => Permission, permission => permission.role)
    permissions: Permission[];
}
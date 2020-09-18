import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

import { Company } from '../companies/company.entity';

@Entity({ name: 'api_keys' })
@Unique('uk_api_keys', ['value', 'company'])
export class ApiKey {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    value: string;

    @Column({ type: 'boolean' })
    enable: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    // relations

    @ManyToOne(type => Company, company => company.apiKeys)
    @JoinColumn({ name: 'company_id' })
    company: Company;
}
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

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

    // relations

    @ManyToOne(type => Company, company => company.apiKeys)
    @JoinColumn({ name: 'company_id' })
    company: Company;
}
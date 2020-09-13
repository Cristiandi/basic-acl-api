import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Company } from '../companies/company.entity';

@Entity({ name: 'projects' })
@Unique('uk_projects', ['code', 'company'])
export class Project {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'varchar', length: 5 })
    code: string;

    // relations

    @ManyToOne(type => Company, company => company.projects)
    @JoinColumn({ name: 'company_id' })
    company: Company;
}
import { company } from 'faker';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Company } from '../companies/company.entity';

@Entity({ name: 'forgotten_password_configs' })
export class ForgottenPasswordConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200 })
  subject: string;

  @Column({ type: 'varchar', length: 200 })
  redirectUrl: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(type => Company, company => company.forgottenPasswordConfigs)
  @JoinColumn({ name: 'forgotten_password_configs_id' })
  company: Company;
}

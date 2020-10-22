import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Company } from '../companies/company.entity';

@Entity({ name: 'forgotten_password_configs' })
export class ForgottenPasswordConfig {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 200 })
  subject: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 200 })
  redirectUrl: string;

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({ type: () => Company })
  @ManyToOne(type => Company, company => company.forgottenPasswordConfigs)
  @JoinColumn({ name: 'forgotten_password_configs_id' })
  company: Company;
}

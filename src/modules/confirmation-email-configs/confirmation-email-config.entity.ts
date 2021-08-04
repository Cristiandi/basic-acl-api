import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Company } from '../companies/company.entity';

@Entity({ name: 'confirmation_email_configs' })
export class ConfirmationEmailConfig {
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

  // relations
  @ApiProperty({ type: () => Company })
  @ManyToOne(type => Company, company => company.confirmationEmailConfigs)
  @JoinColumn({ name: 'company_id' })
  company: Company
}
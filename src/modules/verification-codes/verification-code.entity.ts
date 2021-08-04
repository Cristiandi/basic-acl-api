import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'verification_codes' })
export class VerificationCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  code: string;

  @Column({ name: 'expiration_date', type: 'timestamp' })
  expirationDate: Date;

  @Column({ type: 'varchar', length: 50  })
  type: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
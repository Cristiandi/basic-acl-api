import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'verification_codes' })
export class VerificationCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  code: string;

  @Column({ name: 'expiration_date', type: 'date' })
  expirationDate: Date;

  @Column({ type: 'varchar', length: 50  })
  type: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email?: string;
}
import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 50, unique: true })
  login: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ name: 'password_salt', type: 'varchar', length: 255 })
  passwordSalt: string;

  @Column({ name: 'display_name', type: 'varchar', length: 100 })
  displayName: string;

  @CreateDateColumn({ name: 'registered_at' })
  registeredAt: Date;
}



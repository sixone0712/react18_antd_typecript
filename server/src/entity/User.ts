import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Timestamp, OneToMany } from 'typeorm';
import { Job } from './Job';

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ type: 'timestamp' })
  created: Date;

  @Column({ type: 'text', array: true })
  permission: string[];

  @Column({ type: 'timestamp', name: 'last_access' })
  lastAccess: Date;

  @OneToMany(() => Job, (job) => job.id)
  job: Job[];
}

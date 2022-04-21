import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity('job_type')
export class JobType extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'full_string' })
  fullString: string;

  @Column({ name: 'represent_string' })
  representString: string;
}

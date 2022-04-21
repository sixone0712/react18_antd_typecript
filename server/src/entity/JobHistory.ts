import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Job } from './Job';

@Entity('job_history')
export class JobHistory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Job, (job) => job.id)
  @JoinColumn()
  job: Job;

  @Column()
  type: string;

  @Column({ type: 'text', name: 'file_id' })
  fileId: string;

  @Column({ type: 'timestamp' })
  created: Date;
}

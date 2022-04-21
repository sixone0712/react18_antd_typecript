import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { JobNotification } from './JobNotification';
import { JobStatus } from './JobStatus';
import { JobType } from './JobType';
import { Site } from './Site';
import { User } from './User';

@Entity('job')
export class Job extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Site, (site) => site.siteId)
  @JoinColumn({ name: 'site_id' })
  siteId: Site;

  @Column('integer', { name: 'plan_ids', array: true, nullable: true })
  planids: number[];

  @ManyToOne(() => JobStatus, (josStatus) => josStatus.id)
  @JoinColumn({ name: 'collect_status' })
  collectStatus: JobStatus;

  @ManyToOne(() => JobStatus, (josStatus) => josStatus.id)
  @JoinColumn({ name: 'error_summary_status' })
  errorSummaryStatus: JobStatus;

  @ManyToOne(() => JobStatus, (josStatus) => josStatus.id)
  @JoinColumn({ name: 'cras_data_status' })
  crasDataStatus: JobStatus;

  @ManyToOne(() => JobStatus, (josStatus) => josStatus.id)
  @JoinColumn({ name: 'mpa_version_status' })
  mpaVersionStatus: JobStatus;

  @Column()
  stop: boolean;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'owner' })
  owner: User;

  @Column({ type: 'timestamp' })
  created: Date;

  @Column({ type: 'timestamp', name: 'last_action' })
  lastAction: Date;

  @ManyToOne(() => JobType, (jobType) => jobType.id)
  @JoinColumn({ name: 'job_type' })
  jobType: JobType;

  @OneToOne(() => JobNotification)
  @JoinColumn()
  notification: JobNotification;

  @Column('text', { name: 'file_ids', array: true, nullable: true })
  fileIds: string[];

  @Column('text', { name: 'file_names', array: true, nullable: true })
  fileNames: string[];
}

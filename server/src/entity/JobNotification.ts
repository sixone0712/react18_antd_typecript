import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MailContext } from './MailContext';

@Entity('job_notification')
export class JobNotification extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'is_error_summary' })
  isErrorSummary: boolean;

  @Column({ name: 'is_cras_data' })
  isCrasData: boolean;

  @Column({ name: 'is_mpa_version' })
  isMpaVersion: boolean;

  @OneToOne(() => MailContext)
  @JoinColumn({ name: 'error_summary_email' })
  errorSummaryEmail: MailContext;

  @OneToOne(() => MailContext)
  @JoinColumn({ name: 'cras_data_email' })
  crasDataEmail: MailContext;

  @OneToOne(() => MailContext)
  @JoinColumn({ name: 'mpa_version_email' })
  mpaVersionEmail: MailContext;

  @Column({ type: 'text', name: 'sending_times', array: true })
  sending_times: string[];

  @Column()
  before: number;
}

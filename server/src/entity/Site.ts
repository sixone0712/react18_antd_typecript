import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from 'typeorm';
import { Job } from './Job';

@Entity('site')
export class Site extends BaseEntity {
  @PrimaryGeneratedColumn()
  siteId: number;

  @Column({ name: 'cras_site_name' })
  crasSiteName: string;

  @Column({ name: 'cras_address' })
  crasAddress: string;

  @Column({ name: 'cras_port' })
  crasPort: number;

  @Column({ name: 'email_address' })
  emailAddress: string;

  @Column({ name: 'email_port' })
  emailPort: number;

  @Column({ name: 'email_username' })
  emailUserName: string;

  @Column({ name: 'email_password' })
  emailPassword: string;

  @Column({ name: 'email_from' })
  emailFrom: string;

  @Column({ name: 'rss_address' })
  rssAddress: string;

  @Column({ name: 'rss_port' })
  rssPort: number;

  @Column({ name: 'rss_username' })
  rssUserName: string;

  @Column({ name: 'rss_password' })
  rssPassword: string;

  @OneToMany(() => Job, (job) => job.id)
  job: Job[];
}

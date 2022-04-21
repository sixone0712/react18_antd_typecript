import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('mail_context')
export class MailContext extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', array: true })
  recipients: string[];

  @Column({ type: 'text' })
  subject: string;

  @Column({ type: 'text' })
  body: string;
}

import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, PrimaryColumn } from 'typeorm';

@Entity('setting_db')
export class SettingDB extends BaseEntity {
  @PrimaryColumn()
  address: string;

  @Column()
  port: number;

  @Column()
  user: string;

  @Column()
  password: string;
}

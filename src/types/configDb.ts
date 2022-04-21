export interface SiteDB {
  id: number;
  site_name: string;
  fab_name: string;
  address: string;
  port: number;
  user: string;
  password: string;
  db_address: string;
  db_port: number;
  db_password: string;
  mpa_count: number;
}

export interface SettingDB {
  address: string;
  port: number;
  user: string;
  password: string;
}

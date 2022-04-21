import { Input } from 'antd';
import { JobStatusType } from './Job';

export interface ErrorLogReduxState {
  siteId: number | null;
  siteName: string | null;
  show: ErrorLogShowState;
  reqDownload: ErrorLogReqDownloadState;
}

export interface ErrorLogShowState {
  isDownloadModal: boolean;
  isDownloadDrawer: boolean;
  isImportModal: boolean;
}
export interface ErrorLogState {
  index?: number;
  equipment_name: string | null; //text not null
  error_code: string | null; //text
  error_message: string | null; //text
  occurrence_count: number; //integer
  occurred_date: string | null; //timestamp not null
  reseted_date: string | null; //timestamp
  ppid: string | null; //text
  device: string | null; //text
  process: string | null; //text
  glass_id: string | null; //text
  lot_id: string | null; //text
  chuck: string | null; //text
  // log_idx: number; //integer not null
  // log_time: string | null; //timestamp default now() not null
  // request_id: string | null; //varchar(50)
  // created_time: string | null; //timestamp
  downloadIdx?: number;
}

export interface ErrorLogSettingState {
  error_code_range: string;
  type: PLAN_FTP_TYPE;
  command: string;
  before: string;
  after: string;
}

export interface ErrorLogReqDownloadState {
  error_code: string | null;
  occurred_date: string | null;
  equipment_name: string | null;
  type: PLAN_FTP_TYPE | null;
  command: string | null;
  before: string | null;
  after: string | null;
  device: string | null;
  process: string | null;
}

export interface ErrorLogReqDownload {
  siteId: number;
  error_code: string;
  occurred_date: string;
  equipment_name: string;
  type: PLAN_FTP_TYPE;
  command: string;
  start: string;
  end: string;
  device: string;
  process: string;
}

export interface ErrorLogDownloadTable {
  index?: number;
  error_code: string;
  equipment_name: string;
  occurred_date: string;
  device: string;
  process: string;
  type: PLAN_FTP_TYPE;
  start: string;
  end: string;
  start_end?: string;
  command: string;
  status: JobStatusType;
  download_id: string;
  download_url: string;
  error: string;
}

export interface SearchTextState {
  error_code: React.Key;
  equipment_name: React.Key;
  error_message: React.Key;
  occurrence_count: React.Key;
  occurred_date: React.Key;
  ppid: React.Key;
  device: React.Key;
  process: React.Key;
  glass_id: React.Key;
  lot_id: React.Key;
  chuck: React.Key;
}

export interface SearchedColumnState {
  error_code: boolean;
  equipment_name: boolean;
  error_message: boolean;
  occurrence_count: boolean;
  occurred_date: boolean;
  ppid: boolean;
  device: boolean;
  process: boolean;
  glass_id: boolean;
  lot_id: boolean;
  chuck: boolean;
}

export interface SearchInputRef {
  error_code: Input | null;
  equipment_name: Input | null;
  error_message: Input | null;
  occurrence_count: Input | null;
  occurred_date: Input | null;
  ppid: Input | null;
  device: Input | null;
  process: Input | null;
  glass_id: Input | null;
  lot_id: Input | null;
  chuck: Input | null;
}

export type PLAN_FTP_TYPE = 'FTP' | 'VFTP(COMPAT)' | 'VFTP(SSS)';

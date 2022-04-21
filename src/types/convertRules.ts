export interface ReqEditLogName {
  log_name: string;
  table_name: string;
  rule_type: string;
  rule_list: number[];
  select: number[];
  tag: string[];
  ignore: string[];
  retention: number;
}

export interface ConvertRuleItemErrorMsg {
  index?: number;
  // equip: string | null;
  // file: string | null;
  // err_msg: string | null;
  // log: number | null;
  // date: string | null;
  id: number | null;
  log_id: number | null;
  created: string | null;
  equipment: string | null;
  file: string | null;
  content: string | null;
  row: number | null;
  msg: string | null;
}

export interface ConvertRuleItem {
  id: number;
  log_name: string;
  rules: number;
  errors: number;
  select: undefined | number[]; // Rule이 실행되는 SiteId, null or undefined면 all
  table_name: string;
  rule_type: string;
  tag: string[];
  ignore: string[];
  filter: RuleFilterData[];
  retention: number;
}

export interface RuleData {
  index?: number;
  new?: boolean;
  id: number | null;
  ruleId: number | null;
  type: string | null;
  row_index: number | null;
  col_index: number | null;
  column?: string | null;
  data?: string | null;
  name: string | null;
  output_column: string | null;
  output_column_select?: string | null;
  prefix: string | null;
  regex: string | null;
  data_type: string | null;
  coef: number | null;
  def_val: string | null;
  def_type: string | null;
  unit: string | null;
  re_group: number | null;
  skip: boolean;
}

export interface RuleColumnData {
  column_name: string;
  data_type: string | null;
}

export interface PreviewTableData {
  disp_order: string[] | null;
  row: {
    [key: string]: {
      [key: string]: string | number | null;
    };
  } | null;
  text: string | null;
}
export interface PreviewTable {
  data: PreviewTableData | null;
}

export interface PreviewText {
  data: string | null;
}

export interface AddLogName {
  name: string;
  select: null | undefined | number[]; // Rule이 실행되는 SiteId, null or undefined면 all
}

export interface RuleInfo {
  id: number;
  rule_name: string;
  table_name: string;
  rule_type: 'csv' | 'regex';
  col: number;
}

export interface RuleOption {
  data_type: string[];
  def_type: string[];
  filter_type: string[];
}

export interface BaseRule {
  log_name: string;
  table_name: string;
  rule_name: string;
  rule_type: 'csv' | 'regex';
  convert: {
    info: RuleData[];
    header: RuleData[];
    custom: RuleData[];
  };
  columns: RuleColumnData[];
  // filter: RuleFilterData[];
}

export interface ReqConvertPreviewConvert extends PreviewTable {
  convert: {
    info: Partial<RuleData>[];
    header: Partial<RuleData>[];
    custom: Partial<RuleData>[];
  };
}

export interface CrasError {
  path?: string;
  error?: string;
  error_list?: CrasErrorList[];
}

export interface CrasErrorList {
  index?: number;
  table?: 'header' | 'info' | 'custom' | 'filter';
  key: string;
  name: string;
  reason: string;
}
export interface ReqConvertPreviewError {
  cras_error: CrasError;
}

export interface RuleFilterData {
  index?: number;
  name: string | null;
  type: string | null;
  condition: string | null;
}

export interface ReqConvertPreviewFilter extends PreviewTable {
  filter: RuleFilterData[];
}

export interface RuleConvert {
  info: RuleData[];
  header: RuleData[];
  custom: RuleData[];
}

export interface ReqRuleConvert {
  info: Partial<RuleData>[];
  header: Partial<RuleData>[];
  custom: Partial<RuleData>[];
}

export interface SaveConvertRule {
  log_name: string | undefined;
  table_name: string | undefined;
  rule_name: string | undefined;
  rule_type: 'csv' | 'regex' | undefined;
  convert: RuleConvert;
  filter: RuleFilterData[];
}

export interface ReqSaveConvertRule {
  log_name: string | undefined;
  table_name: string | undefined;
  rule_type: 'csv' | 'regex' | undefined;
  rule_name: string | undefined;
  convert: ReqRuleConvert;
  filter: RuleFilterData[];
}

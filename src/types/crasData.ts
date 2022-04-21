export interface CrasDataSiteInfo {
  siteId: number;
  name: string;
}

export interface CrasDataInfo {
  index: number;
  id: number;
  siteId: number;
  companyFabName: string;
  createCrasDataItemCount: number;
  crasDataJudgeRulesItemCount: number;
  date: string;
}

export interface CrasDataManualInfo {
  index: number;
  itemId: number;
  itemName: string;
  enable: boolean;
}

export interface CrasDataCreateInfo {
  itemId: number;
  itemName: string;
  enable: boolean;
  targetTable: string;
  targetCol: string[];
  comments: string;
  operations: string;
  calPeriodUnit: string;
  calResultType: string;
  coef: number;
  manualWhere: string;
}

export interface CrasDataJudgeInfo {
  itemId: number;
  itemName: string;
  enable: boolean;
  title: string;
  description: string;
  calRange: number;
  calCondition: string;
  threshold: number;
  compare: string;
}

export interface CrasDataCreateOption {
  operations: string[];
  calPeriodUnit: string[];
  calResultType: string[];
}

export interface CrasDataJudgeOption {
  calCondition: string[];
  compareValueToThreshold: string[];
}

export interface ResCrasDataAdd {
  id: number;
  error: boolean;
}

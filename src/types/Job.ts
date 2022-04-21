import { AddressOption } from './address';

export type JobType = 'remote' | 'local';
export type RemoteJobType = 'add' | 'edit';
export type JobStepType = 'collect' | 'convert' | 'summary' | 'cras' | 'version' | 'purge' | 'notice' | 'custom';
export type JobStatusType = 'success' | 'failure' | 'nodata' | 'processing' | 'notbuild' | 'canceled';
export type JobCycleType = 'hour' | 'minute' | 'day';
export type JobModeType = 'cycle' | 'time' | 'pre' | 'next' | 'none';
export type JobScriptType = 'python' | 'shell';

export type PlanStatusType = 'registered' | 'collecting' | 'collected' | 'suspended' | 'halted' | 'completed';
export const REMOTE_JOB_STEP = {
  PLANS: 0,
  STEPS: 1,
  CHECK: 2,
};

export const LOCAL_JOB_STEP = {
  CONFIGURE: 0,
  OTHER: 1,
  CHECK: 2,
};

export const AVAILABLE_MANUAL_EXCUTE_STEPS = ['collect', 'convert', 'summary', 'cras', 'version', 'purge', 'custom'];

export enum REMOTE_JOB_VALIDATION_ERROR {
  NO_ERROR = 0,
  PLAN_NO_JOB_NAME,
  PLAN_NO_USER_FAB_NAME,
  PLAN_NO_PLANS,
  STEP_NO_STEPS,
  STEP_NO_TIME,
  STEP_NO_PRVIOUS_VALUE,
}

export enum LOCAL_JOB_VALIDATION_ERROR {
  NO_ERROR = 0,
  CONFIG_NO_JOB_NAME,
  CONFIG_NO_SITE,
  CONFIG_NO_FILES,
  CONFIG_UPLOADING_FILES,
  OTHER_NO_RECIPIENTS,
}

export const BEFORE_SUMMARY_DEF_VALUE = 30;
export const BEFORE_CRAS_VERSION_DEF_VALUE = 7;

// 1. GET Remote Job List
// GET /api/v1/status/job/remote
// RemoteJobStatus[]
export interface RemoteJobStatusState {
  index: number; // only use front
  jobId: number;
  siteId: number;
  stop: boolean;
  companyName: string;
  fabName: string;
  companyFabName?: string;
  jobName: string;
  lastSuccess: BuildHistoryState | null;
  lastFailure: BuildHistoryState | null;
  lastSuccessDate: RemoteJobLastResultDate; // only use front
  lastFailureDate: RemoteJobLastResultDate; // only use front
}

export interface RemoteJobLastResultDate {
  key: 'lastSuccess' | 'lastFailure';
  date: string | null;
}

export interface BuildHistoryState {
  index?: number;
  historyId: string;
  stepId: number;
  stepType: JobStepType;
  stepName: string;
  date: string;
  manual: boolean;
  status: JobStatusType;
  error: string[];
}

// 2. GET Remote Job Step Status Info
// GET /api/v1/status/job/remote/{jobId}/step
// RemoteJobStepStatus[]
export interface RemoteJobStepStatus {
  jobId: number | null;
  stepId: number | null;
  status: JobStatusType;
  error: string[];
  stepName: string | null;
  stepType: JobStepType;
  uuid: string | null;
  mode: JobModeType | null;
  time: string[];
  cycle: JobCycleType | null;
  period: number | null;
  preStep: string | null;
  nextStep: string | null;
  description: string | null;
  lastSuccess: BuildHistoryState | null;
  lastFailure: BuildHistoryState | null;
  lastSuccessDate: RemoteJobLastResultDate; // only use front
  lastFailureDate: RemoteJobLastResultDate; // only use front
  enable: boolean;
}

// 3. GET Remote Job Build Queue Info : 앞으로 계획
// GET /api/v1/status/job/remote/{jobId}/buildqueue
// 4. GET Remote Job Build Executor Status Info : 현재 processing 것만 표시
// GET /api/v1/status/job/remote/{jobId}/buildexecutor
// RemoteBuildQueueStatus[]
export interface RemoteBuildQueueStatus {
  date: string;
  stepName: string;
  stepType: JobStepType;
  manual: boolean;
  status: JobStepType;
}

// 5. GET Remote Job Detail Info
// GET /api/v1/job/remote/{jobId}
export interface RemoteJobDetailState {
  jobId: number | null;
  jobName: string | null;
  siteId: number | null;
  siteName: string | null;
  planIds: number[];
  steps: RemoteJobStepDetailState[];
}

// 6. GET Remote Job Step Info
// GET /api/v1/job/remote/{jobId}/step/{stepId}

export interface RemoteJobStepDetailState {
  uuid: string | null;
  stepId: number | null;
  stepName: string | null;
  stepType: JobStepType;
  enable: boolean;
  mode: JobModeType | null;
  time: string[];
  cycle: JobCycleType | null;
  period: number | null;
  preStep: string | null;
  nextStep: string | null;
  isEmail: boolean;
  customEmails: string[];
  emailBook: AddressOption[];
  groupBook: AddressOption[];
  subject: string | null;
  body: string | null;
  before: number | null;
  selectJudgeRules: SelectJudgeRule[];
  description: string | null;
  scriptType: JobScriptType | null;
  script: string | null;
  fileIndices: number[];
}

export interface RemoteJobStepKeyState {
  uuid: string | null;
  stepName: string | null;
}
export interface SelectJudgeRule {
  itemId: number;
  itemName: string;
  enable: boolean;
}

// 7. GET Remote Job Enable Step
// GET /api/v1/job/remote/{jobId}/step/enable
export interface RemoteJobStepEnable {
  stepId: number;
  enable: boolean;
  stepName: string;
  stepType: JobStepType;
}

// 8. Add Remote Job Step
// POST /api/v1/job/remote/step
// RemoteJobStepDetailState

export interface ReqRemoteJobStep {
  uuid: string | null;
  stepId: number | null;
  stepName: string | null;
  stepType: JobStepType | null;
  enable: boolean;
  mode: JobModeType | null;
  time: string[];
  cycle: JobCycleType | null;
  period: number | null;
  preStep: string | null;
  nextStep: string | null;
  isEmail: boolean;
  customEmails: string[];
  emailBookIds: number[];
  groupBookIds: number[];
  subject: string | null;
  body: string | null;
  before: number | null;
  selectJudgeRuleIds: number[];
  description: string | null;
  scriptType: JobScriptType | null;
  script: string | null;
  fileIndices: number[];
}

export interface ReqRemoteJob {
  siteId: number;
  jobName: string;
  planIds: number[];
  steps: ReqRemoteJobStep[];
}

/////////////////////
export interface RemoteJobJudgeRule {
  itemId: number;
  itemName: string;
  enable: boolean;
}

export interface TransferRemoteJobJudgeRule extends RemoteJobJudgeRule {
  key: string;
}

export interface RemoteJobPlanDetailState {
  index?: number;
  planId: number;
  planName: string;
  planType: string;
  machineNames: string[];
  targetNames: string[];
  description: string;
  status: string;
  error: string;
  measure: string;
  detail: PlanStatusType;
  machineCount?: number;
  targetCount?: number;
}

export interface RemoteJobStepItemVisible {
  isEmail: boolean;
  isExcuteMode: boolean;
  isScript: boolean;
  isBefore: boolean;
  isJudgeRules: boolean;
}

export interface RemoteJobStepSubItemVisible {
  isExcuteMode: boolean;
  isEmail: boolean;
  isSubject: boolean;
  isBody: boolean;
  isBefore: boolean;
  isJudgeRules: boolean;
}

export interface LocalJobStatusState {
  index?: number;
  jobId: number;
  jobName: string;
  siteId: number;
  fabName: string;
  companyName: string;
  companyFabName?: string;
  stop: boolean;
  stepType: JobStepType;
  status: JobStatusType;
  error: string[];
  fileIndices: number[];
  fileOriginalNames: string[];
  registeredDate: string;
  stepId: number;
  historyId: string | null;
}

export interface ReqLocalJob {
  jobName: string;
  siteId: number;
  steps: ReqRemoteJobStep[];
}

export interface RemoteJobStepMilestone {
  stepName: string | null;
  stepType: JobStepType;
  uuid: string | null;
  mode: JobModeType | null;
  time: string[];
  cycle: JobCycleType | null;
  period: number | null;
  preStep: string | null;
  nextStep: string | null;
  enable: boolean;
}

export interface RegisteredJob {
  companyName: string;
  fabName: string;
  jobId: number;
  jobName: string;
  siteId: number;
  stop: boolean;
}

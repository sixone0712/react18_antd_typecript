import { JobStepType, JobType } from '../types/Job';

export const breadcrumbLocation = {
  status_remote: ['Status', 'Remote'],
  status_local: ['Status', 'Remote'],
  configure: ['Configure'],
  rules_logdef: ['Rules', 'Log Definition'],
  rules_logconv: ['Rules', 'Log Converter'],
};

export const LOG_HISTORY_MAX_LIST_COUNT = 50;
export const ERROR_SUMMARY_DEFAULT_BEFORE = 7;
export const CRAS_DATA_DEFAULT_BEFORE = 30;
export const MPA_VERSION_DEFAULT_BEFORE = 7;
export const EMAIL_ADDRESS_MAX = 100;
export const EMAIL_SUBJECT_MAX = 255;
export const EMAIL_BEFORE_MAX = 999;
export const CONFIGURE_NAME_MAX = 30;
export const DEFAULT_PASSWORD_VALUE = '******';
export const ACCESS_TOKEN_NAME = 'access-token';
export const REFRESH_TOKEN_NAME = 'refresh-token';
export const TOKEN_PATH = '/';
export const SESSION_STORAGE_EXPIRED = 'expired';
export const NAME_MAX_LENGTH = 30;

export const DISPLAY_LOCALHOST_NAME = 'localhost';
export const CRAS_LOCALHOST_NAME = 'Cras-Server';
export const RSS_LOCALHOST_NAME = 'Rapid-Collector';
export const DEAFULT_URL = '/logmonitor';

export const PAGE_URL = {
  LOGIN_ROUTE: DEAFULT_URL + '/login',
  STATUS_ROUTE: DEAFULT_URL + '/status',
  STATUS_REMOTE_ROUTE: DEAFULT_URL + '/status/remote',
  STATUS_REMOTE_STEP_ROUTE: DEAFULT_URL + '/status/remote/step/:jobId',
  STATUS_REMOTE_ADD_ROUTE: DEAFULT_URL + '/status/remote/add',
  STATUS_REMOTE_EDIT_ROUTE: DEAFULT_URL + '/status/remote/edit',
  STATUS_LOCAL_ROUTE: DEAFULT_URL + '/status/local',
  STATUS_LOCAL_ADD_ROUTE: DEAFULT_URL + '/status/local/add',

  STATUS_ERROR_LOG_ROUTE: DEAFULT_URL + '/status/errorlog',
  CONFIGURE_ROUTE: DEAFULT_URL + '/configure',
  RULES_ROUTE: DEAFULT_URL + '/rules',
  RULES_CONVERT_RULES_ROUTE: DEAFULT_URL + '/rules/convert-rules',
  RULES_CONVERT_RULES_EDIT_ROUTE: DEAFULT_URL + '/rules/convert-rules/edit/:id',
  RULES_CRAS_DATA_ROUTE: DEAFULT_URL + '/rules/cras-data',
  RULES_CRAS_DATA_EDIT_CREATE_ROUTE: DEAFULT_URL + '/rules/cras-data/create/:id',
  RULES_CRAS_DATA_EDIT_JUDGE_ROUTE: DEAFULT_URL + '/rules/cras-data/judge/:id',
  ADDRESS_BOOK_ROUTE: DEAFULT_URL + '/address',
  ACCOUNT_ROUTE: DEAFULT_URL + '/account',
  DEBUG_LOG_ROUTE: DEAFULT_URL + '/debug/log',
  FORBBIDEN_ROUTE: DEAFULT_URL + '/forbbiden',

  STATUS_LOCAL: DEAFULT_URL + '/status/local',
  STATUS_LOCAL_ADD: DEAFULT_URL + '/status/local/add',
  STATUS_REMOTE: DEAFULT_URL + '/status/remote',
  STATUS_REMOTE_STEP: ({ jobId, jobName }: { jobId: number | string; jobName: string }): string =>
    DEAFULT_URL + `/status/remote/step/${jobId}?name=${jobName}`,
  STATUS_REMOTE_ADD: DEAFULT_URL + '/status/remote/add',
  STATUS_REMOTE_EDIT: ({
    jobId,
    siteId,
    jobName,
  }: {
    jobId: string | number;
    siteId: string | number;
    jobName: string;
  }): string => DEAFULT_URL + `/status/remote/edit?sid=${siteId}&jid=${jobId}&name=${jobName}`,

  STATUS_REMOTE_BUILD_HISTORY_TYPE: DEAFULT_URL + '/status/remote/history',
  STATUS_LOCAL_BUILD_HISTORY_TYPE: DEAFULT_URL + '/status/local/history',
  STATUS_REMOTE_BUILD_HISTORY_ROUTE: DEAFULT_URL + '/status/remote/history/:stepType/:jobId',
  STATUS_LOCAL_BUILD_HISTORY_ROUTE: DEAFULT_URL + '/status/local/history/:stepType/:jobId',
  STATUS_REMOTE_LOCAL_BUILD_HISTORY: ({
    type,
    stepType,
    jobId,
    stepId,
    stepName,
    jobName,
    historyId,
  }: {
    type: JobType;
    stepType: JobStepType;
    jobId: number | string;
    stepId: number | string;
    stepName?: string;
    jobName?: string | null;
    historyId?: string | null;
  }): string => {
    let url = DEAFULT_URL + `/status/${type}/history/${stepType}/${jobId}`;
    const params = [`jobId=${jobId}`, `stepId=${stepId}`];

    jobName && params.push(`jobName=${jobName}`);
    stepName && params.push(`stepName=${stepName}`);
    historyId && params.push(`historyId=${historyId}`);
    params.forEach((item, idx) => {
      const andChar = idx === 0 ? '?' : '&';
      url = url + andChar + item;
    });

    return url;
  },

  CONFIGURE: DEAFULT_URL + '/configure',
  ADDRESS_BOOK: DEAFULT_URL + '/address',
  ACCOUNT: DEAFULT_URL + '/account',
  RULES_CRAS_DATA_EDIT_CREATE: (id: string | number, name: string): string =>
    DEAFULT_URL + `/rules/cras-data/create/${id}?name=${name}`,
  RULES_CRAS_DATA_EDIT_JUDGE: (id: string | number, name: string): string =>
    DEAFULT_URL + `/rules/cras-data/judge/${id}?name=${name}`,
  RULES_CONVERT_RULES_EDIT: (id: string | number, name: string): string =>
    DEAFULT_URL + `/rules/convert-rules/edit/${id}?name=${name}`,
};

export const API_URL = {
  GET_STATUS_SITE_LIST: DEAFULT_URL + '/api/v1/status/site',
  GET_STATUS_SITE_LIST_NOT_ADDED_REMOTE_JOB: DEAFULT_URL + '/api/v1/status/site/job',
  GET_STATUS_SITE_LIST_NOT_ADDED_CRAS_DATA: DEAFULT_URL + '/api/v1/status/site/cras',

  UPLOAD_STATUS_LOCAL_JOB_FILE_URL: DEAFULT_URL + '/api/v1/upload',

  GET_STATUS_BUILD_HISTORY_LIST: ({
    type,
    jobId,
    stepId,
  }: {
    type: JobType;
    jobId: number | string;
    stepId: number | string;
  }): string => DEAFULT_URL + `/api/v1/history/${type}/${jobId}/${stepId}`,
  GET_STATUS_BUILD_HISTORY_LOG: ({
    type,
    jobId,
    stepId,
    historyId,
  }: {
    type: JobType;
    jobId: number | string;
    stepId: number | string;
    historyId: string | number;
  }): string => DEAFULT_URL + `/api/v1/history/${type}/${jobId}/${stepId}/${historyId}`,

  GET_STATUS_REMOTE_JOB_LIST: DEAFULT_URL + '/api/v1/status/job/remote',
  GET_STATUS_REMOTE_JOB_STEP_LIST: (jobId: string | number): string =>
    DEAFULT_URL + `/api/v1/status/job/remote/${jobId}/step`,
  GET_STATUS_REMOTE_JOB_BUILD_QUEUE: (jobId: string | number): string =>
    DEAFULT_URL + `/api/v1/status/job/remote/${jobId}/buildqueue`,
  GET_STATUS_REMOTE_JOB_BUILD_EXECUTOR: (jobId: string | number): string =>
    DEAFULT_URL + `/api/v1/status/job/remote/${jobId}/buildexecutor`,
  GET_STATUS_REGISTERED_JOB_FOR_SITE: (siteId: string | number): string =>
    DEAFULT_URL + `/api/v1/status/site/${siteId}/job`,
  GET_STATUS_REMOTE_JOB_INFO: (id: string | number): string => DEAFULT_URL + `/api/v1/job/remote/${id}`,
  GET_STATUS_REMOTE_JOB_TIME_LINE: (id: string | number): string => DEAFULT_URL + `/api/v1/job/remote/timeline/${id}`,
  GET_STATUS_REMOTE_JOB_STOP_STATUS: (jobId: string | number): string =>
    DEAFULT_URL + `/api/v1/status/job/remote/${jobId}/status`,
  GET_STATUS_REMOTE_PLAN_LIST: (siteId: string | number): string => DEAFULT_URL + `/api/v1/job/remote/plan/${siteId}`,
  POST_STATUS_REMOTE_JOB: DEAFULT_URL + '/api/v1/job/remote',
  PUT_STATUS_REMOTE_JOB: (jobId: string | number): string => DEAFULT_URL + `/api/v1/job/remote/${jobId}`,
  DELETE_STATUS_REMOTE_JOB: (jobId: string | number): string => DEAFULT_URL + `/api/v1/job/remote/${jobId}`,
  RUN_STATUS_REMOTE_JOB: (jobId: string | number): string => DEAFULT_URL + `/api/v1/job/remote/${jobId}/run`,
  STOP_STATUS_REMOTE_JOB: (jobId: string | number): string => DEAFULT_URL + `/api/v1/job/remote/${jobId}/stop`,
  EXCUTE_MANUAL_STATUS_REMOTE_STEP: (jobId: string | number, stepId: string | number): string =>
    DEAFULT_URL + `/api/v1/job/remote/manual/${jobId}/${stepId}`,
  GET_STATUS_REMOTE_JOB_JUDGE_RULE_LIST: (siteId: string | number): string =>
    DEAFULT_URL + `/api/v1/rule/cras/${siteId}/judge/enable`,
  GET_STATUS_LOCAL_JOB_LIST: DEAFULT_URL + '/api/v1/status/job/local',
  POST_STATUS_LOCAL_JOB: DEAFULT_URL + '/api/v1/job/local',
  DELETE_STATUS_LOCAL_JOB: (jobId: string | number): string => DEAFULT_URL + `/api/v1/job/local/${jobId}`,

  GET_ERROR_LOG_LIST: (siteId: string | number): string => DEAFULT_URL + `/api/v1/errorlog/${siteId}`,
  GET_ERROR_LOG_SETTING_LIST: (siteId: string | number): string => DEAFULT_URL + `/api/v1/errorlog/setting/${siteId}`,
  POST_ERROR_LOG_DOWNLOAD: (siteId: string | number): string => DEAFULT_URL + `/api/v1/errorlog/download/${siteId}`,
  GET_ERROR_LOG_DOWNLOAD_LIST: (siteId: string | number): string => DEAFULT_URL + `/api/v1/errorlog/download/${siteId}`,
  GET_ERROR_LOG_DOWNLOAD: DEAFULT_URL + '/api/v1/errorlog/download',
  GET_ERROR_LOG_DOWNLOAD_STATUS: DEAFULT_URL + '/api/v1/errorlog/download/status',
  GET_ERROR_LOG_EXPORT: (siteId: string | number): string => DEAFULT_URL + `/api/v1/upload/errorlog/${siteId}`,
  GET_ERROR_LOG_IMPORT: (siteId: string | number): string => DEAFULT_URL + `/api/v1/upload/errorlog/${siteId}`,
  GET_ERROR_LOG_DOWNLOAD_FILE: (id: string): string => DEAFULT_URL + `/api/v1/errorlog/download/file/${id}`,

  GET_CONFIGURE_SITE_DB: DEAFULT_URL + '/api/v1/site',
  POST_CONFIGURE_SITE_DB: DEAFULT_URL + '/api/v1/site',
  GET_CONFIGURE_SITE_DB_DETAIL: (siteId: string | number): string => DEAFULT_URL + `/api/v1/site/${siteId}`,
  PUT_CONFIGURE_SITE_DB: (siteId: string | number): string => DEAFULT_URL + `/api/v1/site/${siteId}`,
  DELETE_CONFIGURE_SITE_DB: (siteId: string | number): string => DEAFULT_URL + `/api/v1/site/${siteId}`,
  GET_CONFIGURE_HOST_DB: DEAFULT_URL + '/api/v1/host',
  POST_CONFIGURE_HOST_DB: DEAFULT_URL + '/api/v1/host',
  GET_CONFITURE_CRAS_CONNECTION: DEAFULT_URL + '/api/v1/site/connection/cras',
  GET_CONFITURE_EMAIL_CONNECTION: DEAFULT_URL + '/api/v1/site/connection/email',
  GET_CONFITURE_RSS_CONNECTION: DEAFULT_URL + '/api/v1/site/connection/rss',
  GET_CONFIGURE_LOG_MONITOR_VERSION: DEAFULT_URL + '/api/v1/version',
  GET_CONFIGURE_SITE_JOB_STATUS: (siteId: string | number): string => DEAFULT_URL + `/api/v1/site/${siteId}/jobstatus`,
  GET_LOG_MONITOR_OOS: DEAFULT_URL + '/LICENSE.md',

  GET_AUTH_LOGIN: (username: string, password: string): string =>
    DEAFULT_URL + `/api/v1/auth/login?username=${username}&password=${password}`,
  GET_AUTH_ME: DEAFULT_URL + '/api/v1/auth/me',
  GET_AUTH_LOGOUT: DEAFULT_URL + '/api/v1/auth/logout',
  POST_AUTH_REISSUE: DEAFULT_URL + '/api/v1/auth/reissue',

  GET_USER_LIST: DEAFULT_URL + '/api/v1/user',
  POST_USER_SIGN_UP: DEAFULT_URL + '/api/v1/user',
  DELETE_USER: (userId: string | number): string => DEAFULT_URL + `/api/v1/user/${userId}`,
  PUT_USER_ROLES: (userId: string | number): string => DEAFULT_URL + `/api/v1/user/${userId}/roles`,
  PUT_USER_PASSWORD: (userId: string | number): string => DEAFULT_URL + `/api/v1/user/${userId}/password`,

  GET_ADDRESS_GROUP_EMAIL_LIST: DEAFULT_URL + '/api/v1/address',
  GET_ADDRESS_GROUP_LIST: DEAFULT_URL + '/api/v1/address/group',
  GET_ADDRESS_GROUP_LIST_IN_EMAIL: (emailId: string | number): string =>
    DEAFULT_URL + `/api/v1/address/email/${emailId}/group`,
  GET_ADDRESS_EMAIL_LIST: DEAFULT_URL + '/api/v1/address/email',
  GET_ADDRESS_EMAIL_LIST_BY_GROUP: (groupId: string | number): string =>
    DEAFULT_URL + `/api/v1/address/group/${groupId}/email/`,
  SEARCH_ADDRESS_EMAIL: (keyword: string): string => DEAFULT_URL + `/api/v1/address/search?keyword=${keyword}`,
  SEARCH_ADDRESS_GROUP_EMAIL: (keyword: string): string =>
    DEAFULT_URL + `/api/v1/address/search?keyword=${keyword}&group=true`,

  POST_ADDRESS_ADD_EMAIL: DEAFULT_URL + '/api/v1/address/email',
  DELETE_ADDRESS_DELETE_EMAIL: (emailIds: number[]): string =>
    DEAFULT_URL + `/api/v1/address/email?ids=${emailIds.toString()}`,
  PUT_ADDRESS_EDIT_EMAIL: (emailId: string | number): string => DEAFULT_URL + `/api/v1/address/email/${emailId}`,
  POST_ADDRESS_ADD_GROUP: DEAFULT_URL + '/api/v1/address/group',
  PUT_ADDRESS_EDIT_GROUP: (groupId: string | number): string => DEAFULT_URL + `/api/v1/address/group/${groupId}`,
  DELETE_ADDRESS_DELETE_GROUP: (groupId: string | number): string => DEAFULT_URL + `/api/v1/address/group/${groupId}`,

  GET_CRAS_INFO_LIST: DEAFULT_URL + '/api/v1/rule/cras',
  POST_CRAS_SITE_ADD: DEAFULT_URL + '/api/v1/rule/cras',
  DELETE_CRAS_SITE_DELETE: (id: string | number): string => DEAFULT_URL + `/api/v1/rule/cras/${id}`,
  GET_CRAS_MANUAL_CREATE_INFO_LIST: (id: string | number): string => DEAFULT_URL + `/api/v1/rule/cras/${id}/create`,
  GET_CRAS_MANUAL_CREATE_INFO_DETAIL: (id: string | number, itemId: string | number): string =>
    DEAFULT_URL + `/api/v1/rule/cras/${id}/create/${itemId}`,
  GET_CRAS_MANUAL_CREATE_TARGET_TABLE: (id: string | number): string => DEAFULT_URL + `/api/v1/rule/cras/${id}/table`,
  GET_CRAS_MANUAL_CREATE_TARGET_COLUMN: (id: string | number, name: string): string =>
    DEAFULT_URL + `/api/v1/rule/cras/${id}/table/${name}`,
  POST_CRAS_MANUAL_CREATE_TEST_QUERY: DEAFULT_URL + '/api/v1/rule/cras/testquery',
  POST_CRAS_MANUAL_CREATE_ADD: (id: string | number): string => DEAFULT_URL + `/api/v1/rule/cras/${id}/create`,
  PUT_CRAS_MANUAL_CREATE_EDIT: (id: string | number, itemId: string | number): string =>
    DEAFULT_URL + `/api/v1/rule/cras/${id}/create/${itemId}`,
  DELETE_CRAS_MANUAL_CREATE_DELETE: (id: string | number, itemId: string | number): string =>
    DEAFULT_URL + `/api/v1/rule/cras/${id}/create/${itemId}`,
  GET_CRAS_MANUAL_JUDGE_INFO_LIST: (id: string | number): string => DEAFULT_URL + `/api/v1/rule/cras/${id}/judge`,
  GET_CRAS_MANUAL_JUDGE_INFO_DETAIL: (id: string | number, itemId: string | number): string =>
    DEAFULT_URL + `/api/v1/rule/cras/${id}/judge/${itemId}`,
  POST_CRAS_MANUAL_JUDGE_ADD: (id: string | number): string => DEAFULT_URL + `/api/v1/rule/cras/${id}/judge`,
  PUT_CRAS_MANUAL_JUDGE_EDIT: (id: string | number, itemId: string | number): string =>
    DEAFULT_URL + `/api/v1/rule/cras/${id}/judge/${itemId}`,
  DELETE_CRAS_MANUAL_JUDGE_DELETE: (id: string | number, itemId: string | number): string =>
    DEAFULT_URL + `/api/v1/rule/cras/${id}/judge/${itemId}`,
  GET_CRAS_MANUAL_CREATE_OPTION: DEAFULT_URL + '/api/v1/rule/cras/option/createlist',
  GET_CRAS_MANUAL_JUDGE_OPTION: DEAFULT_URL + '/api/v1/rule/cras/option/judgelist',

  POST_CRAS_IMPORT_FILE: (id: string | number): string => DEAFULT_URL + `/api/v1/upload/crasdatafile/${id}`,
  GET_CRAS_EXPORT_FILE: (id: string | number): string => DEAFULT_URL + `/api/v1/upload/crasdatafile/${id}`,

  GET_CONVERT_ITEM: (id: string | number): string => DEAFULT_URL + `/api/v1/rule/convert/log/${id}`,
  GET_CONVERT_ERROR: (id: string | number): string => DEAFULT_URL + `/api/v1/rule/convert/log/${id}/error`,
  GET_CONVERT_ITEM_LIST: DEAFULT_URL + '/api/v1/rule/convert/log',
  GET_CONVERT_RULE_LIST: (logNameId: string | number): string =>
    DEAFULT_URL + `/api/v1/rule/convert/log/${logNameId}/rule`,
  GET_CONVERT_RULE_ITEM: (logNameId: string | number, ruleId: string | number): string =>
    DEAFULT_URL + `/api/v1/rule/convert/log/${logNameId}/rule/${ruleId}`,
  GET_CONVERT_BASE_RULE: (logNameId: string | number, baseRuleId: string | number): string =>
    DEAFULT_URL + `/api/v1/rule/convert/log/${logNameId}/rule/${baseRuleId}`,
  PATCH_CONVERT_EDIT_RULE: (logId: string | number, ruleId: string | number): string =>
    DEAFULT_URL + `/api/v1/rule/convert/log/${logId}/rule/${ruleId}`,
  POST_CONVERT_ADD_RULE: (logId: string | number): string => DEAFULT_URL + `/api/v1/rule/convert/log/${logId}/rule`,
  POST_CONVERT_ADD_LOG: DEAFULT_URL + '/api/v1/rule/convert/log',
  DELETE_CONVERT_DELETE_LOG: (logNameId: string | number): string =>
    DEAFULT_URL + `/api/v1/rule/convert/log/${logNameId}`,
  PATCH_CONVERT_EDIT_LOG: (logNameId: string | number): string => DEAFULT_URL + `/api/v1/rule/convert/log/${logNameId}`,
  POST_COINVERT_PREVIEW_SAMPLE: (ruleType: string): string =>
    DEAFULT_URL + `/api/v1/rule/convert/log/preview/${ruleType}`,
  POST_COINVERT_PREVIEW_CONVERT: (ruleType: string): string =>
    DEAFULT_URL + `/api/v1/rule/convert/log/rule/preview/${ruleType}`,
  POST_COINVERT_PREVIEW_FILTER: DEAFULT_URL + '/api/v1/rule/convert/log/filter/preview',
  GET_CONVERT_OPTION: DEAFULT_URL + '/api/v1/rule/convert/option',
  GET_CONVERT_EXPORT_FILE: DEAFULT_URL + `/api/v1/rule/convert/export`,
  POST_CONVERT_IMPORT_FILE: DEAFULT_URL + `/api/v1/rule/convert/import`,
  GET_DOWNLOAD_LOG_MOINITOR_DEBUG_LOG: (path: string): string =>
    DEAFULT_URL + `/api/v1/backup/logmonitor` + encodeURI(`?path=${path}`),
  GET_DOWNLOAD_CRAS_DEBUG_LOG: (siteId: number | string): string => DEAFULT_URL + `/api/v1/backup/crasserver/${siteId}`,
};

export enum USER_ROLE {
  STATUS = 'ROLE_STATUS',
  JOB = 'ROLE_JOB',
  CONFIGURE = 'ROLE_CONFIGURE',
  RULES = 'ROLE_RULES',
  ADDRESS = 'ROLE_ADDRESS',
  ACCOUNT = 'ROLE_ACCOUNT',
}

export enum USER_ROLE_NAME {
  STATUS = 'STATUS',
  JOB = 'JOB',
  CONFIGURE = 'CONFIGURE',
  RULES = 'RULES',
  ADDRESS = 'ADDRESS BOOK',
  ACCOUNT = 'ACCOUNT',
}

export enum ERROR_MESSAGE {
  DUPLICATE_USERNAME = 'duplicate username',
  INVALID_PASSWORD = 'invalid password',
  INVALID_USERNAME = 'invalid username',
  INVALID_CURRENT_PASSWORD = 'invalid current password',
  INVALID_ROLES = 'invalid roles',
  INVALID_USER = 'invalid user',
}

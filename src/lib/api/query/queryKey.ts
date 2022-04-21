import { QueryClient, QueryKey } from 'react-query';
import { SetDataOptions } from 'react-query/types/core/query';

export enum QUERY_KEY {
  STATUS_SITE_LIST = 'STATUS/SITE_LIST',
  STATUS_SITE_LIST_NOT_ADDED_REMOTE_JOB = 'STATUS/SITE_LIST_NOT_ADDED_REMOTE_JOB',
  STATUS_SITE_LIST_NOT_ADDED_CRAS_DATA = 'STATUS/SITE_LIST_NOT_ADDED_CRAS_DATA',
  STATUS_LOCAL_LIST = 'STATUS/LOCAL/LIST',
  STATUS_REMOTE_LIST = 'STATUS/REMOTE/LIST',
  STATUS_REMOTE_STOP = 'STATUS/REMOTE/STOP',
  STATUS_REMOTE_STEP_LIST = 'STATUS/REMOTE/STEP/LIST',
  STATUS_REMOTE_BUILD_QUEUE = 'STATUS/REMOTE/BUILD_QUEUE',
  STATUS_REMOTE_BUILD_EXECUTOR = 'STATUS/REMOTE/BUILD_EXECUTOR',
  STATUS_REMOTE_TIME_LINE = 'STATUS/REMOTE/TIME_LINE',

  STATUS_BUILD_HISTORY = 'STATUS/HISTORY/LIST',

  ERROR_LOG_LIST = 'ERROR_LOG/LIST',
  ERROR_LOG_SETTING_LIST = 'ERROR_LOG/SETTING_LIST',
  ERROR_LOG_DOWNLOAD_LIST = 'ERROR_LOG/DOWNLOAD_LIST',

  HISTORY_LIST = 'HISTORY/LIST',
  CONFIGURE_HOST = 'CONFIGURE/HOST',
  CONFIGURE_SITES = 'CONFIGURE/SITES',
  JOB_REMOTE_JOB_INFO = 'JOB/REMOTE/JOB_INFO',

  JOB_REMOTE_PLANS = 'JOB/REMOTE/PLANS',
  JOB_REMOTE_JOBS = 'JOB/REMOTE/JOBS',
  JOB_REMOTE_JOB_JUDGE_RULE_LIST = 'JOB/REMOTE/JOB_JUDGE_RULE_LIST',

  ACCOUNT_USERS = 'ACCOUNT/USERS',
  ADDRESS_GROUPS = 'ADDRESS/GROUPS',
  ADDRESS_EMAILS = 'ADDRESS/EMAILS',
  ADDRESS_GROUPS_IN_EMAIL = 'ADDRESS/GROUPS_IN_EMAIL',
  ADDRESS_GROUPS_EMAILS = 'ADDRESS/GROUPS_EMAILS',

  RULES_CRAS_LIST = 'RULES/CRAS/LIST',
  RULES_CRAS_MANUAL_CREATE_LIST = 'RULES/CRAS/MANUAL/CREATE/LIST',
  RULES_CRAS_MANUAL_CREATE_DETAIL = 'RULES/CRAS/MANUAL/CREATE/DETAIL',
  RULES_CRAS_MANUAL_CREATE_TARGET_TABLE_LIST = 'RULES/CRAS/MANUAL/CREATE/TARGET/TABLE_LIST',
  RULES_CRAS_MANUAL_CREATE_TARGET_COLUMN_LIST = 'RULES/CRAS/MANUAL/CREATE/TARGET/COLUMN_LIST',

  RULES_CRAS_MANUAL_JUDGE_LIST = 'RULES/CRAS/MANUAL/JUDGE/LIST',
  RULES_CRAS_MANUAL_JUDGE_DETAIL = 'RULES/CRAS/MANUAL/JUDGE/DETAIL',

  RULES_CRAS_MANUAL_CREATE_OPTION = 'RULES/CRAS/MANUAL/CREATE/OPTION',
  RULES_CRAS_MANUAL_JUDGE_OPTION = 'RULES/CRAS/MANUAL/JUDGE/OPTION',

  RULES_CONVERT_LIST = 'RULES/CONVERT/LIST',
  RULES_CONVERT_ITEM = 'RULES/CONVERT/ITEM',
  RULES_CONVERT_ERROR = 'RULES/CONVERT/ERROR',

  RULES_CONVERT_RULE_LIST = 'RULES/CONVERT/RUlE/LIST',
  RULES_CONVERT_RULE_ITEM = 'RULES/CONVERT/RUlE/ITEM',

  RULES_CONVERT_RULE_BASE = 'RULES/CONVERT/RUlE/BASE',

  RULES_CONVERT_PREVIEW_CONVERT = 'RULES/CONVERT/PREVIEW/CONVERT',
  RULES_CONVERT_PREVIEW_FILTER = 'RULES/CONVERT/PREVIEW/FILTER',
}

// type QueryKeys = keyof typeof QUERY_KEY;
// type QueryValues = typeof QUERY_KEY[QueryKeys];

// export const QUERY_KEY: { [key: string]: string[] } = {
// };

// export const createKey = (key: QueryValues, ...rest: any[]): string[] => {
//   return [...key, ...rest];
// };

// export const createKey = (key: QUERY_KEY, ...rest: any[]): string[] => {
//   return [...key.split('/'), ...rest];
// };

type Awaited<T> = T extends Promise<infer U> ? U : T;
export class QueryHelper<TQueryFn extends (...args: any[]) => any> {
  readonly queryKey: QueryKey;
  readonly queryFn: TQueryFn;

  constructor(queryKey: QueryKey, queryFn: TQueryFn) {
    this.queryKey = queryKey;
    this.queryFn = queryFn;
  }

  setQueryData = (
    queryClient: QueryClient,
    updater: (cache: Awaited<TQueryFn>) => Awaited<TQueryFn>,
    options?: SetDataOptions
  ): (() => void) => {
    const queries = queryClient.getQueryCache().findAll(this.queryKey);
    const snapshotQueries = queries.map((query) => [query.queryKey, query.state.data] as const);

    queries.forEach((query) => {
      query.setData((cache: Awaited<ReturnType<TQueryFn>> | undefined) => {
        if (!cache) {
          return cache;
        }

        return updater(JSON.parse(JSON.stringify(cache)));
      }, options);
    });

    return () => {
      snapshotQueries.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    };
  };
}

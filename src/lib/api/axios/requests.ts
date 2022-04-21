import Item from 'antd/lib/list/Item';
import { FormAddConvert } from '../../../hooks/useConvertAdd';
import { FormCrasSiteName } from '../../../hooks/useCrasDataAdd';
import { DEFAULT_ALL_ADDRESS_KEY } from '../../../reducers/slices/address';
import {
  BaseRule,
  ConvertRuleItem,
  ConvertRuleItemErrorMsg,
  PreviewTable,
  ReqConvertPreviewConvert,
  ReqConvertPreviewFilter,
  ReqEditLogName,
  ReqSaveConvertRule,
  RuleInfo,
  RuleOption,
} from '../../../types/convertRules';
import {
  CrasDataCreateInfo,
  CrasDataCreateOption,
  CrasDataInfo,
  CrasDataJudgeInfo,
  CrasDataJudgeOption,
  CrasDataManualInfo,
  CrasDataSiteInfo,
  ResCrasDataAdd,
} from '../../../types/crasData';
import {
  ErrorLogDownloadTable,
  ErrorLogReqDownload,
  ErrorLogSettingState,
  ErrorLogState,
} from '../../../types/errorLog';
import {
  BuildHistoryState,
  LocalJobStatusState,
  RegisteredJob,
  RemoteJobDetailState,
  RemoteJobJudgeRule,
  RemoteJobPlanDetailState,
  RemoteJobStatusState,
  RemoteJobStepStatus,
  ReqLocalJob,
  ReqRemoteJob,
  // RemoteJobReqData,
  // RemoteJobResData,
  // RemoteJobTimeLine,
  TransferRemoteJobJudgeRule,
} from '../../../types/Job';
import { API_URL } from '../../constants';
import { rolesToBoolean } from '../../util/convertUserRoles';
import { sleep } from '../../util/sleep';
import client from './client';
import {
  AddressInfo,
  LoginUserInfo,
  ReqGetBuildHistoryList,
  ReqGetSiteDBInfo,
  ReqLogin,
  ReqPostAddEmail,
  ReqPostAddGroup,
  ReqPostCrasConnection,
  ReqPostCrasDataCreateAdd,
  ReqPostCrasDataJudgeAdd,
  ReqPostCrasDataTestQuery,
  ReqPostEmailConnection,
  ReqPostHostDBInfo,
  ReqPostRssConnection,
  ReqPostSiteDBInfo,
  ReqPutCrasDataCreateEdit,
  ReqPutCrasDataJudgeEdit,
  ReqPutEditEmail,
  ReqPutEditGroup,
  ReqPutSiteDBInfo,
  ReqUser,
  ReqUserPassword,
  ReqUserRoles,
  ResGetAddressInfo,
  ResGetBuildHistoryList,
  ResGetCrasDataList,
  ResGetCrasDataManualInfo,
  ResGetHostDBInfo,
  ResGetLoginInfo,
  ResGetLogMonitorVersion,
  ResGetSiteJobStatus,
  ResGetSiteName,
  ResUser,
  SiteDBInfo,
  UserInfo,
} from './types';

export const getStatusSiteList = async (): Promise<ResGetSiteName[]> => {
  const { data } = await client.get<ResGetSiteName[]>(API_URL.GET_STATUS_SITE_LIST);
  return data.map((item, index) => ({
    ...item,
    crasCompanyFabName: `${item.crasCompanyName}-${item.crasFabName}`,
  }));
};

export const getStatusRegisteredJobForSite = async (siteId: number): Promise<RegisteredJob[]> => {
  const { data } = await client.get<RegisteredJob[]>(API_URL.GET_STATUS_REGISTERED_JOB_FOR_SITE(siteId));
  return data;
};

export const getStatusRemoteJob = async (): Promise<RemoteJobStatusState[]> => {
  const { data } = await client.get<Omit<RemoteJobStatusState, 'index' | 'lastSuccessDate' | 'lastFailureDate'>[]>(
    API_URL.GET_STATUS_REMOTE_JOB_LIST
  );

  return data.map((item, index) => ({
    ...item,
    index: index,
    companyFabName: `${item.companyName}-${item.fabName}`,
    lastSuccessDate: {
      key: 'lastSuccess',
      date: item.lastSuccess?.date ?? null,
    },
    lastFailureDate: {
      key: 'lastFailure',
      date: item.lastFailure?.date ?? null,
    },
  }));
};

export const getStatusRemoteJobStep = async (jobId: number | string): Promise<RemoteJobStepStatus[]> => {
  const { data } = await client.get<Omit<RemoteJobStepStatus, 'lastSuccessDate' | 'lastFailureDate'>[]>(
    API_URL.GET_STATUS_REMOTE_JOB_STEP_LIST(jobId)
  );
  return data.map((item) => ({
    ...item,
    lastSuccessDate: {
      key: 'lastSuccess',
      date: item.lastSuccess?.date ?? null,
    },
    lastFailureDate: {
      key: 'lastFailure',
      date: item.lastFailure?.date ?? null,
    },
  }));
};

export const getStatusRemoteJobBuildQueue = async (jobId: number | string): Promise<BuildHistoryState[]> => {
  const { data } = await client.get<BuildHistoryState[]>(API_URL.GET_STATUS_REMOTE_JOB_BUILD_QUEUE(jobId));
  return data.map((item, index) => ({ ...item, index }));
};

export const getStatusRemoteJobBuildExecutor = async (jobId: number | string): Promise<BuildHistoryState[]> => {
  const { data } = await client.get<BuildHistoryState[]>(API_URL.GET_STATUS_REMOTE_JOB_BUILD_EXECUTOR(jobId));
  return data.map((item, index) => ({ ...item, index }));
};

export const getStatusRemoteJobStop = async (jobId: number | string): Promise<{ stop: boolean }> => {
  const { data } = await client.get<{ stop: boolean }>(API_URL.GET_STATUS_REMOTE_JOB_STOP_STATUS(jobId));
  return data;
};

export const getRemoteJobInfo = async (jobId: number | string): Promise<RemoteJobDetailState> => {
  const { data } = await client.get<RemoteJobDetailState>(API_URL.GET_STATUS_REMOTE_JOB_INFO(jobId));

  return {
    ...data,
    steps: data.steps.map((item, idx) => ({
      ...item,
      index: idx,
    })),
  };
};

export const getRemoteJobPlans = async (siteId: number): Promise<RemoteJobPlanDetailState[]> => {
  const { data } = await client.get<RemoteJobPlanDetailState[]>(API_URL.GET_STATUS_REMOTE_PLAN_LIST(siteId));
  return data.map((item, index) => ({
    ...item,
    index: index,
    machineCount: item.machineNames.length,
    targetCount: item.targetNames.length,
  }));
};

export const stopRemoteJob = async (jobId: string | number) => {
  const { data } = await client.patch(API_URL.STOP_STATUS_REMOTE_JOB(jobId));
  return data;
};

export const startRemoteJob = async (jobId: string | number) => {
  const { data } = await client.patch(API_URL.RUN_STATUS_REMOTE_JOB(jobId));
  return data;
};

export const excuteManualRemoteStep = async (jobId: string | number, stepId: string | number) => {
  const { data } = await client.patch(API_URL.EXCUTE_MANUAL_STATUS_REMOTE_STEP(jobId, stepId));
  return data;
};

export const postRemoteJob = async (reqData: ReqRemoteJob) => {
  const { data } = await client.post(API_URL.POST_STATUS_REMOTE_JOB, reqData);
  return data;
};

export const putRemoteJob = async ({ jobId, reqData }: { jobId: number; reqData: ReqRemoteJob }) => {
  const { data } = await client.put(API_URL.PUT_STATUS_REMOTE_JOB(jobId), reqData);
  return data;
};

export const deleteRemoteJob = async (jobId: string | number) => {
  const { data } = await client.delete(API_URL.DELETE_STATUS_REMOTE_JOB(jobId));
  return data;
};

export const getStatusLocalJob = async (): Promise<LocalJobStatusState[]> => {
  const { data } = await client.get<LocalJobStatusState[]>(API_URL.GET_STATUS_LOCAL_JOB_LIST);
  return data.map((item, index) => ({
    ...item,
    index: index,
    companyFabName: `${item.companyName}-${item.fabName}`,
  }));
};

export const postLocalJob = async (reqData: ReqLocalJob) => {
  const { data } = await client.post(API_URL.POST_STATUS_LOCAL_JOB, reqData);
  return data;
};

export const deleteLocalJob = async (jobId: number) => {
  const { data } = await client.delete(API_URL.DELETE_STATUS_LOCAL_JOB(jobId));
  return data;
};

export const getErrorLogList = async (siteId: number | string): Promise<ErrorLogState[]> => {
  const { data } = await client.get<ErrorLogState[]>(API_URL.GET_ERROR_LOG_LIST(siteId));
  return data.map((item, idx) => ({
    ...item,
    index: idx + 1,
    id: idx,
  }));
};

export const postErrorLogDownload = async (reqData: ErrorLogReqDownload) => {
  const { data } = await client.post(API_URL.POST_ERROR_LOG_DOWNLOAD(reqData.siteId), reqData);
  return data;
};

export const getErrorLogSettingList = async (siteId: number | string): Promise<ErrorLogSettingState[]> => {
  const { data } = await client.get<ErrorLogSettingState[]>(API_URL.GET_ERROR_LOG_SETTING_LIST(siteId));
  return data;
};

export const getErrorLogDownloadList = async (siteId: number): Promise<ErrorLogDownloadTable[]> => {
  const { data } = await client.get<ErrorLogDownloadTable[]>(API_URL.GET_ERROR_LOG_DOWNLOAD_LIST(siteId));
  return data.map((item, idx) => ({
    ...item,
    index: idx + 1,
    start_end: `${item.start}~${item.end}`,
  }));
};

export const getErrorLogExport = async (siteId: number | string) => {
  const { data, headers } = await client.get(API_URL.GET_ERROR_LOG_EXPORT(siteId), {
    responseType: 'blob',
  });

  const disposition = headers['content-disposition'];
  const fileName = getFileName(disposition);

  return { data, fileName };
};

export const postErrorLogImport = async (siteId: number | string, formData: FormData) => {
  const { data } = await client.post(API_URL.GET_ERROR_LOG_IMPORT(siteId), formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const getRemoteJobJudgeRuleList = async (siteId: string | number): Promise<TransferRemoteJobJudgeRule[]> => {
  const { data } = await client.get<RemoteJobJudgeRule[]>(API_URL.GET_STATUS_REMOTE_JOB_JUDGE_RULE_LIST(siteId));

  return data.map((item) => ({ key: `${item.itemId}`, ...item }));
};

export const getHostDBInfo = async (): Promise<ResGetHostDBInfo> => {
  const { data } = await client.get<ResGetHostDBInfo>(API_URL.GET_CONFIGURE_HOST_DB);
  return data;
};

export const postHostDBInfo = async (reqData: ReqPostHostDBInfo) => {
  const { data } = await client.post(API_URL.POST_CONFIGURE_HOST_DB, reqData);
  return data;
};

export const getSiteDBInfo = async (): Promise<SiteDBInfo[]> => {
  const { data } = await client.get<ReqGetSiteDBInfo[]>(API_URL.GET_CONFIGURE_SITE_DB);
  return data.map((item, index) => ({
    ...item,
    index: index,
    crasCompanyFabName: `${item.crasCompanyName}-${item.crasFabName}`,
  }));
};

export const postSiteDBInfo = async (reqData: ReqPostSiteDBInfo) => {
  const { data } = await client.post(API_URL.POST_CONFIGURE_SITE_DB, reqData);
  return data;
};

export const putSiteDBInfo = async (reqData: ReqPutSiteDBInfo) => {
  const { data } = await client.put(API_URL.PUT_CONFIGURE_SITE_DB(reqData.siteId), reqData);
  return data;
};

export const deleteSiteDBInfo = async (siteId: string | number) => {
  const { data } = await client.delete(API_URL.DELETE_CONFIGURE_SITE_DB(siteId));
  return data;
};

export const postCrasConnection = async (reqData: ReqPostCrasConnection) => {
  const { data } = await client.post(API_URL.GET_CONFITURE_CRAS_CONNECTION, reqData);
  return data;
};

export const postEmailConnection = async (reqData: ReqPostEmailConnection) => {
  const { data } = await client.post(API_URL.GET_CONFITURE_EMAIL_CONNECTION, reqData);
  return data;
};
export const postRssConnection = async (reqData: ReqPostRssConnection) => {
  const { data } = await client.post(API_URL.GET_CONFITURE_RSS_CONNECTION, reqData);
  return data;
};

export const getHistoryBuildList = async (reqData: ReqGetBuildHistoryList): Promise<ResGetBuildHistoryList[]> => {
  const { data } = await client.get(API_URL.GET_STATUS_BUILD_HISTORY_LIST(reqData));
  return data;
};

export const getLogMonitorServerVersion = async (): Promise<ResGetLogMonitorVersion> => {
  const { data } = await client.get(API_URL.GET_CONFIGURE_LOG_MONITOR_VERSION);
  return data;
};

export const getSiteJobStatus = async (siteId: string | number): Promise<ResGetSiteJobStatus> => {
  const { data } = await client.get(API_URL.GET_CONFIGURE_SITE_JOB_STATUS(siteId));
  return data;
};

export const getLogMonitorOos = async (): Promise<string> => {
  const { data } = await client.get(API_URL.GET_LOG_MONITOR_OOS);
  return data;
};

export const login = async (loginData: ReqLogin): Promise<LoginUserInfo> => {
  const { data } = await client.get<ResGetLoginInfo>(API_URL.GET_AUTH_LOGIN(loginData.username, loginData.password));

  return {
    id: data.id,
    username: data.username,
    roles: {
      ...rolesToBoolean(data.roles),
    },
    timeout: data.timeout,
  };
};

export const getMe = async (): Promise<LoginUserInfo> => {
  const { data } = await client.get<ResGetLoginInfo>(API_URL.GET_AUTH_ME);

  return {
    id: data.id,
    username: data.username,
    roles: {
      ...rolesToBoolean(data.roles),
    },
    timeout: data.timeout,
  };
};

export const logout = async () => {
  const { data } = await client.get(API_URL.GET_AUTH_LOGOUT);
  return data;
};

export const getUsers = async (): Promise<UserInfo[]> => {
  const { data } = await client.get<ResUser[]>(API_URL.GET_USER_LIST);
  return data.map((item, index) => ({
    index: index,
    ...item,
    roles: {
      ...rolesToBoolean(item.roles),
    },
  }));
};

export const postUser = async (reqData: ReqUser) => {
  const { data } = await client.post(API_URL.POST_USER_SIGN_UP, reqData);
  return data;
};

export const deleteUser = async (id: number) => {
  const { data } = await client.delete(API_URL.DELETE_USER(id));
  return data;
};

export const putUserPassword = async (userId: string | number, reqData: ReqUserPassword) => {
  const { data } = await client.put(API_URL.PUT_USER_PASSWORD(userId), reqData);
  return data;
};

export const putUserRoles = async (userId: string | number, reqData: ReqUserRoles) => {
  const { data } = await client.put(API_URL.PUT_USER_ROLES(userId), reqData);
  return data;
};

export const getAddressGroupList = async (): Promise<AddressInfo[]> => {
  const { data } = await client.get<ResGetAddressInfo[]>(API_URL.GET_ADDRESS_GROUP_LIST);
  // return data.map((res, idx) => ({
  //   index: idx,
  //   ...res,
  // }));
  return data;
};

export const getAddressGroupListInEmail = async (emailId: number | string): Promise<AddressInfo[]> => {
  const { data } = await client.get<ResGetAddressInfo[]>(API_URL.GET_ADDRESS_GROUP_LIST_IN_EMAIL(emailId));
  // return data.map((res, idx) => ({
  //   index: idx,
  //   ...res,
  // }));
  return data;
};

export const getAddressEmailList = async (gorupId: string | number | undefined): Promise<AddressInfo[]> => {
  if (!gorupId || +gorupId === DEFAULT_ALL_ADDRESS_KEY) {
    const { data } = await client.get<ResGetAddressInfo[]>(API_URL.GET_ADDRESS_EMAIL_LIST);
    // return data.map((res, idx) => ({
    //   index: idx,
    //   ...res,
    // }));
    return data;
  } else {
    const { data } = await client.get<ResGetAddressInfo[]>(API_URL.GET_ADDRESS_EMAIL_LIST_BY_GROUP(gorupId));
    // return data.map((res, idx) => ({
    //   index: idx,
    //   ...res,
    // }));
    return data;
  }
};

export const deleteAddressEmail = async (emailIds: number[]) => {
  const { data } = await client.delete(API_URL.DELETE_ADDRESS_DELETE_EMAIL(emailIds));
  return data;
};

export const searchAddressEmail = async (keyword: string): Promise<AddressInfo[]> => {
  const { data } = await client.get<ResGetAddressInfo[]>(API_URL.SEARCH_ADDRESS_EMAIL(keyword));
  // return data.map((res, idx) => ({
  //   index: idx,
  //   ...res,
  // }));
  return data;
};

export const searchAddressEmailAndGroup = async (keyword: string): Promise<AddressInfo[]> => {
  const { data } = await client.get<ResGetAddressInfo[]>(API_URL.SEARCH_ADDRESS_GROUP_EMAIL(keyword));
  // return data.map((res, idx) => ({
  //   index: idx,
  //   ...res,
  // }));
  return data;
};

export const postAddressAddEmail = async (reqData: ReqPostAddEmail) => {
  const { data } = await client.post(API_URL.POST_ADDRESS_ADD_EMAIL, reqData);
  return data;
};

export const putAddressEditEmail = async (reqData: ReqPutEditEmail) => {
  const { id, name, email, groupIds } = reqData;
  const { data } = await client.put(API_URL.PUT_ADDRESS_EDIT_EMAIL(id), { name, email, groupIds });
  return data;
};

export const postAddressAddGroup = async (reqData: ReqPostAddGroup) => {
  const { data } = await client.post(API_URL.POST_ADDRESS_ADD_GROUP, reqData);
  return data;
};

export const putAddressEditGroup = async (reqData: ReqPutEditGroup) => {
  const { id, name, emailIds } = reqData;
  const { data } = await client.put(API_URL.PUT_ADDRESS_EDIT_GROUP(id!), { name, emailIds });
  return data;
};

export const deleteAddressGroup = async (groupId: number | string) => {
  const { data } = await client.delete(API_URL.DELETE_ADDRESS_DELETE_GROUP(groupId));
  return data;
};

export const getAddressGroupEmailList = async (): Promise<AddressInfo[]> => {
  const { data } = await client.get<ResGetAddressInfo[]>(API_URL.GET_ADDRESS_GROUP_EMAIL_LIST);
  return data;
};

export const getCrasInfoList = async (): Promise<CrasDataInfo[]> => {
  const { data } = await client.get<ResGetCrasDataList[]>(API_URL.GET_CRAS_INFO_LIST);
  return data.map((item, idx) => ({
    index: idx,
    ...item,
  }));
};

export const getCrasSiteInfoList = async (): Promise<CrasDataSiteInfo[]> => {
  const { data } = await client.get<CrasDataSiteInfo[]>(API_URL.GET_STATUS_SITE_LIST_NOT_ADDED_CRAS_DATA);
  return data;
};

export const postCrasAddSite = async (reqData: FormCrasSiteName) => {
  const { data } = await client.post<Promise<ResCrasDataAdd>>(API_URL.POST_CRAS_SITE_ADD, reqData);
  return data;
};

export const DeleteCrasDeleteSite = async (id: number) => {
  const { data } = await client.delete(API_URL.DELETE_CRAS_SITE_DELETE(id));
  return data;
};

export const getCrasManualCreateInfoList = async (id: number): Promise<CrasDataManualInfo[]> => {
  const { data } = await client.get<ResGetCrasDataManualInfo[]>(API_URL.GET_CRAS_MANUAL_CREATE_INFO_LIST(id));
  return data.map((item, idx) => ({
    index: idx,
    ...item,
  }));
};

export const getCrasManualCreateInfoDetail = async (id: number, itemId: number): Promise<CrasDataCreateInfo> => {
  const { data } = await client.get<CrasDataCreateInfo>(API_URL.GET_CRAS_MANUAL_CREATE_INFO_DETAIL(id, itemId));
  return data;
};

export const getCrasManualCreateTargetTable = async (id: number): Promise<string[]> => {
  const { data } = await client.get<string[]>(API_URL.GET_CRAS_MANUAL_CREATE_TARGET_TABLE(id));
  return data;
};

export const getCrasManualCreateTargetColumn = async (id: number, tableName: string): Promise<string[]> => {
  const { data } = await client.get<string[]>(API_URL.GET_CRAS_MANUAL_CREATE_TARGET_COLUMN(id, tableName));
  return data;
};

export const getCrasManualJudgeInfoList = async (id: number): Promise<CrasDataManualInfo[]> => {
  const { data } = await client.get<ResGetCrasDataManualInfo[]>(API_URL.GET_CRAS_MANUAL_JUDGE_INFO_LIST(id));
  return data.map((item, idx) => ({
    index: idx,
    ...item,
  }));
};

export const getCrasManualJudgeInfoDetail = async (id: number, itemId: number): Promise<CrasDataJudgeInfo> => {
  const { data } = await client.get<CrasDataJudgeInfo>(API_URL.GET_CRAS_MANUAL_JUDGE_INFO_DETAIL(id, itemId));
  return data;
};

export const postCrasManualCreateTestQuery = async (reqData: ReqPostCrasDataTestQuery) => {
  const { data } = await client.post(API_URL.POST_CRAS_MANUAL_CREATE_TEST_QUERY, reqData);
  return data;
};

export const postCrasManualCreateAdd = async (id: number, reqData: ReqPostCrasDataCreateAdd) => {
  const { data } = await client.post(API_URL.POST_CRAS_MANUAL_CREATE_ADD(id), reqData);
  return data;
};

export const putCrasManualCreateEdit = async (id: number, itemId: number, reqData: ReqPutCrasDataCreateEdit) => {
  const { data } = await client.put(API_URL.PUT_CRAS_MANUAL_CREATE_EDIT(id, itemId), reqData);
  return data;
};

export const deleteCrasManualCreateDelete = async (id: number, itemId: number) => {
  const { data } = await client.delete(API_URL.DELETE_CRAS_MANUAL_CREATE_DELETE(id, itemId));
  return data;
};

export const postCrasManualJudgeAdd = async (id: number, reqData: ReqPostCrasDataJudgeAdd) => {
  const { data } = await client.post(API_URL.POST_CRAS_MANUAL_JUDGE_ADD(id), reqData);
  return data;
};

export const putCrasManualJudgeEdit = async (id: number, itemId: number, reqData: ReqPutCrasDataJudgeEdit) => {
  const { data } = await client.put(API_URL.PUT_CRAS_MANUAL_JUDGE_EDIT(id, itemId), reqData);
  return data;
};

export const deleteCrasManualJudgeDelete = async (id: number, itemId: number) => {
  const { data } = await client.delete(API_URL.DELETE_CRAS_MANUAL_JUDGE_DELETE(id, itemId));
  return data;
};

export const getCrasManualCreateOption = async (): Promise<CrasDataCreateOption> => {
  const { data } = await client.get(API_URL.GET_CRAS_MANUAL_CREATE_OPTION);
  return data;
};

export const getCrasManualJudgeOption = async (): Promise<CrasDataJudgeOption> => {
  const { data } = await client.get(API_URL.GET_CRAS_MANUAL_JUDGE_OPTION);
  return data;
};

export const postCrasImportFile = async (id: number, formData: FormData) => {
  const { data } = await client.post(API_URL.POST_CRAS_IMPORT_FILE(id), formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const getCrasExportFile = async (id: number) => {
  const { data, headers } = await client.get(API_URL.GET_CRAS_EXPORT_FILE(id), {
    responseType: 'blob',
  });

  const disposition = headers['content-disposition'];
  const fileName = getFileName(disposition);

  return { data, fileName };
};

export const getConvertItem = async (id: number): Promise<ConvertRuleItem> => {
  const { data } = await client.get<ConvertRuleItem>(API_URL.GET_CONVERT_ITEM(id));
  return data;
};

export const getConvertItemList = async (): Promise<ConvertRuleItem[]> => {
  const { data } = await client.get<ConvertRuleItem[]>(API_URL.GET_CONVERT_ITEM_LIST);
  return data;
};

export const getConvertError = async (id: number): Promise<ConvertRuleItemErrorMsg[]> => {
  const {
    data: { error },
  } = await client.get<{ error: ConvertRuleItemErrorMsg[] }>(API_URL.GET_CONVERT_ERROR(id));
  return (
    error.map((item, index) => ({
      ...item,
      index,
    })) ?? []
  );
};

export const getConvertRuleList = async (logNameId: number): Promise<RuleInfo[]> => {
  const { data } = await client.get<RuleInfo[]>(API_URL.GET_CONVERT_RULE_LIST(logNameId));
  return data;
};

export const getConvertRuleItem = async (logNameId: number, ruleId: number): Promise<BaseRule> => {
  const { data } = await client.get<BaseRule>(API_URL.GET_CONVERT_RULE_ITEM(logNameId, ruleId));
  return data;
};

export const getConvertBaseRule = async (logNameId: number, baseRuleId: number): Promise<BaseRule> => {
  const { data } = await client.get<BaseRule>(API_URL.GET_CONVERT_BASE_RULE(logNameId, baseRuleId));
  return data;
};

export const postConvertAddLog = async (reqData: FormAddConvert) => {
  const { data } = await client.post(API_URL.POST_CONVERT_ADD_LOG, reqData);
  return data;
};

export const patchConvertEditLog = async (id: number, reqData: ReqEditLogName) => {
  const { data } = await client.patch(API_URL.PATCH_CONVERT_EDIT_LOG(id), reqData);
  return data;
};

export const deleteConvertDeleteLog = async (id: number) => {
  const { data } = await client.delete(API_URL.DELETE_CONVERT_DELETE_LOG(id));
  return data;
};

export const postConvertPreviewSample = async ({
  ruleType,
  formData,
}: {
  ruleType: string;
  formData: FormData;
}): Promise<PreviewTable> => {
  const { data } = await client.post<PreviewTable>(API_URL.POST_COINVERT_PREVIEW_SAMPLE(ruleType), formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};
export const postConvertPreviewConvert = async ({
  ruleType,
  reqData,
}: {
  ruleType: string;
  reqData: ReqConvertPreviewConvert;
}): Promise<PreviewTable> => {
  const { data } = await client.post<PreviewTable>(API_URL.POST_COINVERT_PREVIEW_CONVERT(ruleType), reqData);
  return data;
};

export const postConvertPreviewFilter = async (reqData: ReqConvertPreviewFilter): Promise<PreviewTable> => {
  const { data } = await client.post<PreviewTable>(API_URL.POST_COINVERT_PREVIEW_FILTER, reqData);
  return data;
};

export const getConvertOption = async (): Promise<RuleOption> => {
  const { data } = await client.get<RuleOption>(API_URL.GET_CONVERT_OPTION);
  return data;
};

export const postConvertAddRule = async (logId: number, reqData: ReqSaveConvertRule) => {
  const { data } = await client.post(API_URL.POST_CONVERT_ADD_RULE(logId), reqData);
  return data;
};

export const patchConvertEditRule = async (logId: number, ruleId: number, reqData: ReqSaveConvertRule) => {
  const { data } = await client.patch(API_URL.PATCH_CONVERT_EDIT_RULE(logId, ruleId), reqData);
  return data;
};
export const getConvertExportFile = async () => {
  const { data, headers } = await client.get(API_URL.GET_CONVERT_EXPORT_FILE, {
    responseType: 'blob',
  });
  const disposition = headers['content-disposition'];
  const fileName = getFileName(disposition);

  return { data, fileName };
};

export const postConvertImportFile = async (formData: FormData) => {
  const { data } = await client.post(API_URL.POST_CONVERT_IMPORT_FILE, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const getDownloadLogMonitorDebugLog = async (path: string) => {
  const { data, headers } = await client.get(API_URL.GET_DOWNLOAD_LOG_MOINITOR_DEBUG_LOG(path), {
    responseType: 'blob',
  });

  const disposition = headers['content-disposition'];
  const fileName = getFileName(disposition);

  return { data, fileName };
};

export const getDownloadCrasDebugLog = async (siteId: number) => {
  const { data, headers } = await client.get(API_URL.GET_DOWNLOAD_CRAS_DEBUG_LOG(siteId), {
    responseType: 'blob',
  });

  const disposition = headers['content-disposition'];
  const fileName = getFileName(disposition);

  return { data, fileName };
};

export const getFileName = (disposition: string): string => {
  const fileMatch = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
  if (Array.isArray(fileMatch)) {
    return decodeURI(fileMatch[1].replace(/['"]/g, ''));
  }

  return 'download_file';
};

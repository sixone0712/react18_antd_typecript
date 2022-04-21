import { FormAddEditEmail } from '../../../hooks/useAddressBookAddEditEmail';
import { FormAddEditGroup } from '../../../hooks/useAddressBookAddEditGroup';
import { UserRolesBoolean } from '../../../reducers/slices/loginUser';
import { CrasDataCreateInfo, CrasDataInfo, CrasDataJudgeInfo, CrasDataManualInfo } from '../../../types/crasData';
import { JobStatusType, JobStepType, JobType } from '../../../types/Job';
import { USER_ROLE } from '../../constants';

export interface ClientError {
  errorCode: number;
  errorMsg: string;
}

// export interface ResGetRemoteJobStatus {
//   jobId: number;
//   jobName: string;
//   siteId: number;
//   stop: boolean;
//   companyName: string;
//   fabName: string;
//   collectStatus: BuildStatus;
//   collectError: string[];
//   convertStatus: BuildStatus;
//   convertError: string[];
//   errorSummaryStatus: BuildStatus;
//   errorSummaryError: string[];
//   crasDataStatus: BuildStatus;
//   crasDataError: string[];
//   mpaVersionStatus: BuildStatus;
//   mpaVersionError: string[];
//   dbPurgeStatus: BuildStatus;
//   dbPurgeError: string[];
// }

// export interface RemoteNotification {
//   customEmails: string[];
//   subject: string;
//   body: string;
//   before: number;
// }

// interface ReqRemoteNotification extends RemoteNotification {
//   emailBookIds: number[];
//   groupBookIds: number[];
// }

// export interface ReqPostRemoteJob {
//   jobName: string;
//   siteId: number;
//   planIds: number[];
//   jobType: string;
//   sendingTimes: string[];
//   isErrorSummary: boolean;
//   isCrasData: boolean;
//   isMpaVersion: boolean;
//   errorSummary?: ReqRemoteNotification | undefined;
//   crasData?: ReqRemoteNotification | undefined;
//   mpaVersion?: ReqRemoteNotification | undefined;
// }

// export interface ReqPutRemoteJob {
//   jobId: number | string;
//   data: ReqPostRemoteJob;
// }

// export interface ResPostRemoteJob {
//   jobId: number;
// }

// export interface ResPutRemoteJob extends ResPostRemoteJob {}

// interface ResRemoteNotification extends RemoteNotification {
//   emailBook: AddressInfo[];
//   groupBook: AddressInfo[];
// }

// export interface ResGetRemoteJob {
//   jobName: string;
//   planIds: number[];
//   sendingTimes: string[];
//   isErrorSummary: boolean;
//   isCrasData: boolean;
//   isMpaVersion: boolean;
//   errorSummary?: ResRemoteNotification | undefined;
//   crasData?: ResRemoteNotification | undefined;
//   mpaVersion?: ResRemoteNotification | undefined;
// }

// export interface ResGetLocalJobStatus {
//   jobId: number;
//   companyName: string;
//   fabName: string;
//   companyFabName: string;
//   collectStatus: BuildStatus;
//   fileIndices: number[];
//   fileOriginalNames: string[];
//   registeredDate: string;
//   error: string[];
// }

// export interface ReqPostLocalJob {
//   siteId: number;
//   fileIndices: number[];
//   // filenames: string[];
//   isErrorNotice: boolean;
//   errorNotice: RemoteNotificationReqState | null;
// }

// export interface ResPostLocalJob {
//   siteId: number;
// }

export interface ResGetSiteName {
  siteId: number;
  crasCompanyFabName: string;
  crasCompanyName: string;
  crasFabName: string;
}

// export interface ResGetRemotePlan {
//   planId: number;
//   planName: string;
//   planType: string;
//   machineNames: string[];
//   targetNames: string[];
//   description: string;
//   status: string;
//   error: string;
//   measure: string;
//   detail: REMOTE_PLAN_DETAIL;
// }

export interface ResGetHostDBInfo {
  address: string;
  port: number;
  user: string;
  password: string;
}

export interface ReqPostHostDBInfo {
  address: string;
  port: number;
  user: string;
  password: string;
}

export interface ReqGetSiteDBInfo {
  siteId: number;
  crasCompanyName: string;
  crasFabName: string;
  crasAddress: string;
  crasPort: number;
  emailAddress: string;
  emailPort: number;
  emailUserName: string;
  emailPassword: string;
  emailFrom: string;
  rssAddress: string;
  rssPort: number;
  rssUserName: string;
  rssPassword: string;
}

export interface SiteDBInfo extends ReqPostSiteDBInfo {
  index: number; // Create an index after receiving the response.
  crasCompanyFabName: string;
}

export interface ReqPostSiteDBInfo {
  siteId: number;
  crasCompanyName: string;
  crasFabName: string;
  crasAddress: string;
  crasPort: number;
  emailAddress: string;
  emailPort: number;
  emailUserName: string;
  emailPassword: string;
  emailFrom: string;
  rssAddress: string;
  rssPort: number;
  rssUserName: string;
  rssPassword: string;
}

export interface ReqPutSiteDBInfo extends ReqPostSiteDBInfo {
  siteId: number;
}

export interface ReqPostCrasConnection {
  crasAddress: string;
  crasPort: number;
}

export interface ReqPostEmailConnection {
  emailAddress: string;
  emailPort: number;
  emailUserName: string;
  emailPassword: string;
}

export interface ReqPostRssConnection {
  rssAddress: string;
  rssPort: number;
  rssUserName: string;
  rssPassword: string;
  crasAddress: string;
  crasPort: number;
}

export interface ReqGetBuildHistoryList {
  type: JobType;
  jobId: string;
  stepId: string;
}

export interface ResGetBuildHistoryList {
  id: string;
  status: JobStatusType;
  name: string;
}

export interface ResGetLogMonitorVersion {
  version: string;
}

export interface ResGetSiteJobStatus {
  status: 'running' | 'stopped' | 'none';
}

export interface ReqLogin {
  username: string;
  password: string;
}

export type UserRole = USER_ROLE.JOB | USER_ROLE.CONFIGURE | USER_ROLE.RULES | USER_ROLE.ADDRESS | USER_ROLE.ACCOUNT;

export interface ResGetLoginInfo {
  id: number;
  username: string;
  roles: UserRole[];
  timeout: number;
}

export interface LoginUserInfo {
  id: number;
  username: string;
  roles: UserRolesBoolean;
  timeout: number;
}

export interface ResUser extends ResGetLoginInfo {
  accessAt: string;
  updateAt: string;
}

export interface ReqUser {
  username: string;
  password: string;
  roles: UserRole[];
}

export interface UserInfo {
  index: number;
  id: number;
  username: string;
  roles: UserRolesBoolean;
  accessAt: string;
  updateAt: string;
}

export interface ReqUserRoles {
  roles: UserRole[];
}

export interface ReqUserPassword {
  currentPassword: string;
  newPassword: string;
}

export interface AddressInfo {
  id: number;
  name: string;
  email: string;
  group: boolean;
}

export interface ResGetAddressInfo {
  id: number;
  name: string;
  email: string;
  group: boolean;
}

export interface ReqPostAddEmail extends FormAddEditEmail {}

export interface ReqPutEditEmail extends FormAddEditEmail {
  id: number;
}

export interface ReqPostAddGroup extends FormAddEditGroup {}

export interface ReqPutEditGroup extends FormAddEditGroup {
  id: number;
}

export interface ResGetCrasDataList extends Omit<CrasDataInfo, 'index'> {}

export interface ResGetCrasDataManualInfo extends Omit<CrasDataManualInfo, 'index'> {}

export interface ReqPostCrasDataTestQuery {
  id: number;
  targetTable: string;
  targetCol: string[];
  manualWhere: string;
}

export interface ReqPostCrasDataCreateAdd extends Omit<CrasDataCreateInfo, 'itemId'> {}

export interface ReqPutCrasDataCreateEdit extends Omit<CrasDataCreateInfo, 'itemId'> {}

export interface ReqPostCrasDataJudgeAdd extends Omit<CrasDataJudgeInfo, 'itemId'> {}

export interface ReqPutCrasDataJudgeEdit extends Omit<CrasDataJudgeInfo, 'itemId'> {}

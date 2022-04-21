import { Modal } from 'antd';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useIsFetching, useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { postLocalJob } from '../../lib/api/axios/requests';
import { MUTATION_KEY } from '../../lib/api/query/mutationKey';
import { QUERY_KEY } from '../../lib/api/query/queryKey';
import { PAGE_URL } from '../../lib/constants';
import { openNotification } from '../../lib/util/notification';
import { hasValue } from '../../lib/util/validation';
import { localJobInitReducer, LocalJobReduxState, selectLocalJob } from '../../reducers/slices/localJob';
import useTypedSelector from '../../reducers/useTypedSelector';
import { LOCAL_JOB_STEP, LOCAL_JOB_VALIDATION_ERROR, ReqLocalJob, ReqRemoteJobStep } from '../../types/Job';
import useUploadFiles, { ResponseUploadFile } from '../useUploadFiles';

export default function useLocalJob() {
  const [current, setCurrent] = useState(LOCAL_JOB_STEP.CONFIGURE);
  const localJob = useTypedSelector(selectLocalJob);
  const history = useHistory();
  const dispatch = useDispatch();

  // TODO: There is an error that cannot save the filelist of the upload component of antd to the store of redux.
  // Alternatively, use use-global-hook to share values between hooks.
  // In the future, you will need to move to redux when this problem is resolved.
  const { uploadFiles, setUploadFiles, responseFiles, setResponseFiles, initUploadFiles } = useUploadFiles();

  const isFetchingSiteListData = Boolean(useIsFetching([QUERY_KEY.STATUS_SITE_LIST]));

  const { mutateAsync: mutateAsyncAdd } = useMutation((reqData: ReqLocalJob) => postLocalJob(reqData), {
    mutationKey: MUTATION_KEY.JOB_LOCAL_ADD,
    onError: (error: AxiosError) => {
      openNotification('error', 'Error', 'Failed to add local job!');
    },
    onSuccess: () => {
      openNotification('success', 'Success', 'Succeed to add local job.');
    },
    onSettled: () => {
      onBack();
    },
  });
  const onBack = useCallback(() => {
    history.push(PAGE_URL.STATUS_LOCAL);
  }, [history]);
  const openAddModal = useCallback(() => {
    const confirm = Modal.confirm({
      className: 'add-local-job',
      title: 'Add Local Job',
      content: 'Are you sure to add local job?',
      onOk: async () => {
        diableCancelBtn();
        try {
          const reqData = makeRequestData({ localJob, responseFiles });
          await mutateAsyncAdd(reqData);
        } catch (e) {
          // errors are handled by mutate.
        }
      },
    });

    const diableCancelBtn = () => {
      confirm.update({
        cancelButtonProps: {
          disabled: true,
        },
      });
    };
  }, [localJob, responseFiles, mutateAsyncAdd]);

  const openWarningModal = useCallback((code: LOCAL_JOB_VALIDATION_ERROR) => {
    if (code !== LOCAL_JOB_VALIDATION_ERROR.NO_ERROR) {
      const warning = Modal.warning({
        title: 'Warning',
        content: getLocalJobErrorReasonText(code),
      });
    }
  }, []);

  const onNextAction = useCallback(async () => {
    if (current === LOCAL_JOB_STEP.CONFIGURE) {
      const errCode = configureValidation(localJob, responseFiles);
      if (errCode !== LOCAL_JOB_VALIDATION_ERROR.NO_ERROR) {
        openWarningModal(errCode);
        return false;
      }
    } else if (current === LOCAL_JOB_STEP.OTHER) {
      const errCode = otherValidation(localJob);
      if (errCode !== LOCAL_JOB_VALIDATION_ERROR.NO_ERROR) {
        openWarningModal(errCode);
        return false;
      }
    } else {
      openAddModal();
    }

    return true;
  }, [current, localJob, responseFiles, openWarningModal, openAddModal]);

  const disabledNext = useMemo(() => isFetchingSiteListData, [isFetchingSiteListData]);

  useEffect(() => {
    dispatch(localJobInitReducer());
    initUploadFiles();
  }, []);

  return {
    current,
    setCurrent,
    onNextAction,
    onBack,
    disabledNext,
  };
}

const configureValidation = (jobInfo: LocalJobReduxState, files: ResponseUploadFile[]) => {
  if (!hasValue(jobInfo.siteInfo.jobName)) {
    return LOCAL_JOB_VALIDATION_ERROR.CONFIG_NO_JOB_NAME;
  }

  if (!hasValue(jobInfo.siteInfo.siteId)) {
    return LOCAL_JOB_VALIDATION_ERROR.CONFIG_NO_SITE;
  }

  if (files.filter((item) => item.status === 'uploading').length > 0) {
    return LOCAL_JOB_VALIDATION_ERROR.CONFIG_UPLOADING_FILES;
  }
  if (files.filter((item) => item.status === 'done').length === 0) {
    return LOCAL_JOB_VALIDATION_ERROR.CONFIG_NO_FILES;
  }

  return LOCAL_JOB_VALIDATION_ERROR.NO_ERROR;
};

const otherValidation = (jobInfo: LocalJobReduxState) => {
  if (jobInfo.errorNotice.isEmail) {
    if (jobInfo.errorNotice.recipient.length === 0) {
      return LOCAL_JOB_VALIDATION_ERROR.OTHER_NO_RECIPIENTS;
    }
  }

  return LOCAL_JOB_VALIDATION_ERROR.NO_ERROR;
};

const getLocalJobErrorReasonText = (code: LOCAL_JOB_VALIDATION_ERROR) =>
  ({
    // Configure
    [LOCAL_JOB_VALIDATION_ERROR.CONFIG_NO_JOB_NAME]: 'Please select a job name!',
    [LOCAL_JOB_VALIDATION_ERROR.CONFIG_NO_SITE]: 'Please select a user-fab name!',
    [LOCAL_JOB_VALIDATION_ERROR.CONFIG_UPLOADING_FILES]:
      'File is being uploaded. Please wait until the upload is finished!',
    [LOCAL_JOB_VALIDATION_ERROR.CONFIG_NO_FILES]: 'Please upload at least one file!',

    // Other
    [LOCAL_JOB_VALIDATION_ERROR.OTHER_NO_RECIPIENTS]: 'Please add recipients of error notice!',
  }[code as number] ?? 'Unknown Error!');

const initialReqLocalStep: ReqRemoteJobStep = {
  uuid: null,
  stepId: null,
  stepName: null,
  stepType: 'convert',
  enable: false,
  mode: null,
  time: [],
  cycle: null,
  period: null,
  preStep: null,
  nextStep: null,
  isEmail: false,
  customEmails: [],
  emailBookIds: [],
  groupBookIds: [],
  subject: null,
  body: null,
  before: null,
  selectJudgeRuleIds: [],
  description: null,
  scriptType: null,
  script: null,
  fileIndices: [],
};

const makeRequestData = ({
  localJob,
  responseFiles,
}: {
  localJob: LocalJobReduxState;
  responseFiles: ResponseUploadFile[];
}): ReqLocalJob => {
  const { siteInfo, errorNotice } = localJob;

  const convertStep: ReqRemoteJobStep = {
    ...initialReqLocalStep,
    stepType: 'convert',
    uuid: uuidv4(),
    enable: true,
    fileIndices: responseFiles.reduce((acc, cur) => {
      if (cur.status === 'done' && cur.fileIndex !== undefined) return acc.concat(cur.fileIndex);
      else return acc;
    }, <number[]>[]),
  };

  const noticeStep: ReqRemoteJobStep = {
    ...initialReqLocalStep,
    stepType: 'notice',
    uuid: uuidv4(),
    enable: errorNotice.isEmail,
    isEmail: errorNotice.isEmail,
    customEmails: errorNotice.recipient?.filter((item) => item.id <= 0).map((filtered) => filtered.email) ?? [],
    emailBookIds:
      errorNotice.recipient?.filter((item) => !item.group && item.id > 0).map((filtered) => filtered.id) ?? [],
    groupBookIds: errorNotice.recipient?.filter((item) => item.group).map((filtered) => filtered.id) ?? [],
    fileIndices: responseFiles.reduce((acc, cur) => {
      if (cur.status === 'done' && cur.fileIndex !== undefined) return acc.concat(cur.fileIndex);
      else return acc;
    }, <number[]>[]),
  };

  return {
    jobName: siteInfo.jobName as string,
    siteId: siteInfo.siteId as number,
    steps: [convertStep, noticeStep],
  };
};

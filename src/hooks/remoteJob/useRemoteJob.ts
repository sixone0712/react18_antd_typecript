import { Modal } from 'antd';
import { AxiosError } from 'axios';
import queryString from 'query-string';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useIsFetching, useMutation, useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { getRemoteJobInfo, getRemoteJobJudgeRuleList, postRemoteJob, putRemoteJob } from '../../lib/api/axios/requests';
import { MUTATION_KEY } from '../../lib/api/query/mutationKey';
import { QUERY_KEY } from '../../lib/api/query/queryKey';
import { PAGE_URL } from '../../lib/constants';
import { openNotification } from '../../lib/util/notification';
import { hasArrayWithData, hasValue } from '../../lib/util/validation';
import {
  RemoteJobDetailReduxState,
  remoteJobInfoReducer,
  remoteJobInitReducer,
  remoteJobStepRulesReducer,
  remoteStepsInfoReducer,
  selectRemoteJobInfo,
  selectRemoteJobSteps,
} from '../../reducers/slices/remoteJob';
import useTypedSelector from '../../reducers/useTypedSelector';
import {
  RemoteJobDetailState,
  RemoteJobStepDetailState,
  RemoteJobType,
  REMOTE_JOB_STEP,
  REMOTE_JOB_VALIDATION_ERROR,
  ReqRemoteJob,
  TransferRemoteJobJudgeRule,
} from '../../types/Job';

export function useRemoteJob({ type }: { type: RemoteJobType }) {
  const { search } = useLocation();
  const { sid: siteId, jid: jobId, name: jobName } = queryString.parse(search);
  const history = useHistory();
  const dispatch = useDispatch();
  const [current, setCurrent] = useState(REMOTE_JOB_STEP.PLANS);
  const jobInfo = useTypedSelector(selectRemoteJobInfo);
  const steps = useTypedSelector(selectRemoteJobSteps);
  const isFetchingPlansData = Boolean(useIsFetching([QUERY_KEY.JOB_REMOTE_PLANS]));
  const isFetchingSiteListData = Boolean(useIsFetching([QUERY_KEY.STATUS_SITE_LIST]));

  const { data: jobData, isFetching: isFetchingJobData } = useQuery<RemoteJobDetailState, AxiosError>(
    [QUERY_KEY.JOB_REMOTE_JOB_INFO, jobInfo.jobId],
    () => getRemoteJobInfo(jobInfo.jobId as number),
    {
      enabled: Boolean(jobInfo.jobId) && type === 'edit',
      onError: () => {
        openNotification('error', 'Error', `Failed to get remote job information "${jobInfo.jobName}".`);
      },
      onSuccess: (data) => {
        const { jobId, jobName, planIds, siteId, siteName, steps } = data;
        dispatch(remoteJobInfoReducer({ jobId, jobName, planIds, siteId, siteName }));
        dispatch(remoteStepsInfoReducer(steps));
      },
    }
  );

  const { data: rulesData, isFetching: isFetchingRulesData } = useQuery<TransferRemoteJobJudgeRule[], AxiosError>(
    [QUERY_KEY.JOB_REMOTE_JOB_JUDGE_RULE_LIST, jobInfo.siteId],
    () => getRemoteJobJudgeRuleList(jobInfo.siteId as number),
    {
      enabled: Boolean(jobInfo.siteId),
      onError: (error: AxiosError) => {
        openNotification('error', 'Error', `Failed to response the list of cras data!`, error);
      },
      onSuccess: (data) => {
        dispatch(remoteJobStepRulesReducer(data));
      },
    }
  );

  const { mutateAsync: mutateAsyncAdd } = useMutation((reqData: ReqRemoteJob) => postRemoteJob(reqData), {
    mutationKey: MUTATION_KEY.JOB_REMOTE_ADD,
    onError: (error: AxiosError) => {
      openNotification('error', 'Error', `Failed to ${type} remote job '${jobInfo.jobName}'.`, error);
    },
    onSuccess: () => {
      openNotification('success', 'Success', `Succeed to ${type} remote job '${jobInfo.jobName}'.`);
    },
    onSettled: () => {
      onBack();
    },
  });

  const { mutateAsync: mutateAsyncEdit } = useMutation(
    (reqData: { jobId: number; reqData: ReqRemoteJob }) => putRemoteJob(reqData),
    {
      mutationKey: MUTATION_KEY.JOB_REMOTE_EDIT,
      onError: (error: AxiosError) => {
        openNotification('error', 'Error', `Failed to ${type} remote job '${jobName}'.`, error);
      },
      onSuccess: () => {
        openNotification('success', 'Success', `Succeed to ${type} remote job '${jobName}'.`);
      },
      onSettled: () => {
        onBack();
      },
    }
  );

  const onBack = useCallback(() => {
    history.push(PAGE_URL.STATUS_REMOTE);
  }, [history]);

  const openConfirmModal = useCallback(() => {
    const typeFirstUpper = type === 'add' ? 'Add' : 'Edit';
    const { jobId, jobName } = jobInfo;
    const confirm = Modal.confirm({
      className: `${type}_remote_job`,
      title: `${typeFirstUpper} Remote Job`,
      content: `Are you sure to ${type} remote job?`,

      onOk: async () => {
        diableCancelBtn();
        const reqData = convertReqRemoteJobData({ jobInfo, steps });

        try {
          if (type === 'add') {
            await mutateAsyncAdd(reqData);
          } else {
            await mutateAsyncEdit({ jobId: jobId as number, reqData: reqData });
          }
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
  }, [type, jobInfo, steps, mutateAsyncAdd, mutateAsyncEdit]);

  const openWarningModal = useCallback((code: REMOTE_JOB_VALIDATION_ERROR) => {
    if (code !== REMOTE_JOB_VALIDATION_ERROR.NO_ERROR) {
      const warning = Modal.warning({
        title: 'Warning',
        content: getRemoteJobErrorReasonText(code),
      });
    }
  }, []);

  const onNextAction = useCallback(async () => {
    if (current === REMOTE_JOB_STEP.PLANS) {
      const errCode = plansValidation(jobInfo);
      if (errCode !== REMOTE_JOB_VALIDATION_ERROR.NO_ERROR) {
        openWarningModal(errCode);
        return false;
      }
    } else if (current === REMOTE_JOB_STEP.STEPS) {
      const errCode = stepsValidation(steps);
      if (errCode !== REMOTE_JOB_VALIDATION_ERROR.NO_ERROR) {
        openWarningModal(errCode);
        return false;
      }
    } else {
      openConfirmModal();
    }

    return true;
  }, [current, jobInfo, steps, openWarningModal, openConfirmModal]);

  const disabledNext = useMemo(
    () => isFetchingJobData || isFetchingRulesData || isFetchingPlansData || isFetchingSiteListData,
    [isFetchingJobData, isFetchingRulesData, isFetchingPlansData, isFetchingSiteListData]
  );

  useEffect(() => {
    dispatch(remoteJobInitReducer());
  }, []);

  useEffect(() => {
    if (type === 'edit' && siteId && jobId && jobName) {
      dispatch(
        remoteJobInfoReducer({
          siteId: +siteId,
          jobId: +jobId,
          jobName: jobName as string,
        })
      );
    }
  }, [type, siteId, jobId, jobName]);

  return {
    current,
    setCurrent,
    onBack,
    onNextAction,
    disabledNext,
  };
}

const plansValidation = (jobInfo: RemoteJobDetailReduxState) => {
  if (!hasValue(jobInfo.jobName)) {
    return REMOTE_JOB_VALIDATION_ERROR.PLAN_NO_JOB_NAME;
  }
  if (!hasValue(jobInfo.siteId)) {
    return REMOTE_JOB_VALIDATION_ERROR.PLAN_NO_USER_FAB_NAME;
  }
  if (!hasArrayWithData(jobInfo.planIds)) {
    return REMOTE_JOB_VALIDATION_ERROR.PLAN_NO_PLANS;
  }

  return REMOTE_JOB_VALIDATION_ERROR.NO_ERROR;
};

const stepsValidation = (steps: RemoteJobStepDetailState[]) => {
  if (!hasArrayWithData(steps)) {
    return REMOTE_JOB_VALIDATION_ERROR.STEP_NO_STEPS;
  }

  if (!steps.some((item) => ['cycle', 'time', 'none'].includes(item.mode ?? ''))) {
    return REMOTE_JOB_VALIDATION_ERROR.STEP_NO_TIME;
  }
  if (steps.some((item) => item.mode === 'pre' && !item.preStep)) {
    return REMOTE_JOB_VALIDATION_ERROR.STEP_NO_PRVIOUS_VALUE;
  }

  return REMOTE_JOB_VALIDATION_ERROR.NO_ERROR;
};

const getRemoteJobErrorReasonText = (code: REMOTE_JOB_VALIDATION_ERROR) =>
  ({
    // Plans
    [REMOTE_JOB_VALIDATION_ERROR.PLAN_NO_JOB_NAME]: 'Please input a job name!',
    [REMOTE_JOB_VALIDATION_ERROR.PLAN_NO_USER_FAB_NAME]: 'Please select a user-fab name!',
    [REMOTE_JOB_VALIDATION_ERROR.PLAN_NO_PLANS]: 'Please select at least one plan!',

    // Steps
    [REMOTE_JOB_VALIDATION_ERROR.STEP_NO_STEPS]: 'Please add at least one step!',
    [REMOTE_JOB_VALIDATION_ERROR.STEP_NO_TIME]:
      'There must be at least one Step whose Execute Mode is one of Specified Time, Cycle, and None!',
    [REMOTE_JOB_VALIDATION_ERROR.STEP_NO_PRVIOUS_VALUE]:
      'There is a step whose previous value of Execute Mode is not in the registered step list.',
  }[code as number] ?? 'Unknown Error!');

const convertReqRemoteJobData = ({
  jobInfo,
  steps,
}: {
  jobInfo: RemoteJobDetailReduxState;
  steps: RemoteJobStepDetailState[];
}): ReqRemoteJob => {
  const { siteId, jobName, planIds } = jobInfo;

  return {
    siteId: siteId as number,
    jobName: jobName as string,
    planIds: planIds,
    steps: steps.map((item) => {
      const {
        uuid,
        stepId,
        stepName,
        stepType,
        enable,
        mode,
        time,
        cycle,
        period,
        preStep,
        nextStep,
        isEmail,
        customEmails,
        emailBook,
        groupBook,
        subject,
        body,
        before,
        selectJudgeRules,
        description,
        scriptType,
        script,
        fileIndices,
      } = item;

      return {
        uuid,
        stepId,
        stepName,
        stepType,
        enable,
        mode,
        time,
        cycle,
        period,
        preStep,
        nextStep,
        isEmail,
        customEmails,
        emailBookIds: emailBook?.map((item) => item.id) ?? [],
        groupBookIds: groupBook?.map((item) => item.id) ?? [],
        subject,
        body,
        before,
        selectJudgeRuleIds: selectJudgeRules?.map((item) => item.itemId) ?? [],
        description,
        scriptType,
        script,
        fileIndices: fileIndices ?? [],
      };
    }),
  };
};

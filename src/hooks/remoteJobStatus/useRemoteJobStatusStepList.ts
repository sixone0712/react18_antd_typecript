import { AxiosError } from 'axios';
import { useCallback, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { excuteManualRemoteStep, getStatusRemoteJobStep } from '../../lib/api/axios/requests';
import { QUERY_KEY } from '../../lib/api/query/queryKey';
import { PAGE_URL } from '../../lib/constants';
import { openNotification } from '../../lib/util/notification';
import { LoginUserSelector } from '../../reducers/slices/loginUser';
import useTypedSelector from '../../reducers/useTypedSelector';
import { JobStepType, JobType, RemoteJobStepMilestone, RemoteJobStepStatus } from '../../types/Job';
import { RemoteJobStepParams } from './useRemoteJobStatusStepBuild';
import queryString from 'query-string';

export default function useRemoteJobStatusStepList() {
  const history = useHistory();
  const [isError, setError] = useState(false);
  const { jobId } = useParams<RemoteJobStepParams>();
  const loggedInUser = useTypedSelector(LoginUserSelector);
  const queryClient = useQueryClient();
  const [isMilestone, setIsMilestone] = useState(false);
  const { search } = useLocation();
  const { name: jobName } = queryString.parse(search);

  const { data, isFetching, refetch } = useQuery<RemoteJobStepStatus[]>(
    [QUERY_KEY.STATUS_REMOTE_STEP_LIST, jobId],
    () => getStatusRemoteJobStep(+jobId),
    {
      refetchInterval: 3000,
      enabled: Boolean(jobId),
      onError: () => {
        if (!isError) {
          openNotification('error', 'Error', `Failed to response the status of remote`);
          setError(true);
          queryClient.resetQueries([QUERY_KEY.STATUS_REMOTE_STEP_LIST, jobId], { exact: true });
        }
      },
      onSuccess: () => {
        setError(false);
      },
    }
  );

  const stepMilestone = useMemo<RemoteJobStepMilestone[]>(
    () =>
      data?.map((item) => ({
        stepName: item.stepName,
        stepType: item.stepType,
        uuid: item.uuid,
        mode: item.mode,
        time: item.time,
        cycle: item.cycle,
        period: item.period,
        preStep: item.preStep,
        nextStep: item.nextStep,
        enable: item.enable,
      })) ?? [],
    [data]
  );

  const setMilestone = useCallback((value: boolean) => {
    setIsMilestone(value);
  }, []);

  const status = queryClient.getQueryData<{ stop: boolean }>([QUERY_KEY.STATUS_REMOTE_STOP, jobId]);

  const executeManualStep = useCallback(
    async ({ jobId, stepId, stepName }: { jobId: number | null; stepId: number | null; stepName: string | null }) => {
      try {
        if (jobId === null || stepId === null) {
          throw new Error();
        }
        await excuteManualRemoteStep(jobId, stepId);
        openNotification('success', 'Success', `Succeed to execuate manual step '${stepName}'.`);
      } catch (e) {
        console.error(e);
        openNotification('error', 'Error', `Failed to execuate manual step '${stepName}'!`, e as AxiosError);
      }
    },
    []
  );

  const moveToHistory = useCallback(
    ({
      type,
      stepType,
      jobId,
      stepId,
      stepName,
      historyId,
    }: {
      type: JobType;
      stepType: JobStepType;
      jobId: number | string;
      stepId: number | string;
      stepName?: string;
      historyId?: string | null;
    }) => {
      history.push(
        PAGE_URL.STATUS_REMOTE_LOCAL_BUILD_HISTORY({
          type,
          stepType,
          jobId,
          stepId,
          stepName,
          jobName: jobName as string,
          historyId,
        })
      );
    },

    [history, jobName]
  );

  return {
    data,
    isError,
    loggedInUser,
    status,
    isMilestone,
    setMilestone,
    stepMilestone,
    executeManualStep,
    moveToHistory,
  };
}

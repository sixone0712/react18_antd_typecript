import { useCallback, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import queryString from 'query-string';
import { PAGE_URL } from '../../lib/constants';
import { getStatusRemoteJobStop, startRemoteJob, stopRemoteJob } from '../../lib/api/axios/requests';
import { useQuery } from 'react-query';
import { QUERY_KEY } from '../../lib/api/query/queryKey';
import { openNotification } from '../../lib/util/notification';
import { RemoteJobStepParams } from './useRemoteJobStatusStepBuild';
import { AxiosError } from 'axios';
import { LoginUserSelector } from '../../reducers/slices/loginUser';
import useTypedSelector from '../../reducers/useTypedSelector';
export default function useRemoteJobStatusStep() {
  const { jobId } = useParams<RemoteJobStepParams>();
  const { search } = useLocation();
  const { name } = queryString.parse(search);
  const history = useHistory();
  const [isError, setError] = useState(false);
  const loggedInUser = useTypedSelector(LoginUserSelector);

  const { data: status, isFetching, refetch } = useQuery<{ stop: boolean }>(
    [QUERY_KEY.STATUS_REMOTE_STOP, jobId],
    () => getStatusRemoteJobStop(jobId),
    {
      refetchInterval: 3000,
      enabled: Boolean(jobId),
      onError: () => {
        if (!isError) {
          openNotification('error', 'Error', `Failed to response the status of remote`);
          setError(true);
        }
      },
      onSuccess: () => {
        setError(false);
      },
    }
  );
  const onBack = useCallback(() => {
    history.push(PAGE_URL.STATUS_REMOTE);
  }, [history]);

  const onClickStartStop = useCallback(async () => {
    const isStop = status?.stop;
    console.log(isStop);
    try {
      if (isStop !== undefined) {
        isStop ? await startRemoteJob(jobId) : await stopRemoteJob(jobId);
        openNotification('success', 'Success', `Success to ${isStop ? 'start' : 'stop'} remote job '${name}'!`);
      }
    } catch (error) {
      openNotification(
        'error',
        'Error',
        `Failed to ${isStop ? 'start' : 'stop'} remote job '${name}'!`,
        error as AxiosError
      );
    } finally {
      refetch();
    }
  }, [jobId, status, name, refetch]);

  return {
    name,
    status,
    onBack,
    onClickStartStop,
    loggedInUser,
  };
}

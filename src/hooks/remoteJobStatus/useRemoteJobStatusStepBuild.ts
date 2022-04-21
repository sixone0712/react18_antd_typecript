import queryString from 'query-string';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useLocation, useParams } from 'react-router-dom';
import { getStatusRemoteJobBuildExecutor, getStatusRemoteJobBuildQueue } from '../../lib/api/axios/requests';
import { QUERY_KEY } from '../../lib/api/query/queryKey';
import { openNotification } from '../../lib/util/notification';
import { BuildHistoryState } from '../../types/Job';

export type RemoteJobStepParams = {
  jobId: string;
};
export default function useRemoteJobStatusStepBuild() {
  const [isErrorQueue, setErrorQueue] = useState(false);
  const [isErrorExecutor, setErrorExecutor] = useState(false);
  const { jobId } = useParams<RemoteJobStepParams>();

  const { data: queueData, isFetching: isFetchingQueue, refetch: refetchQueue } = useQuery<BuildHistoryState[]>(
    [QUERY_KEY.STATUS_REMOTE_BUILD_QUEUE, jobId],
    () => getStatusRemoteJobBuildQueue(+jobId),
    {
      refetchInterval: 3000,
      enabled: Boolean(jobId),
      onError: () => {
        if (!isErrorQueue) {
          openNotification('error', 'Error', `Failed to response the status of build queue`);
          setErrorQueue(true);
        }
      },
      onSuccess: () => {
        setErrorQueue(false);
      },
    }
  );

  const { data: executorData, isFetching: isFetchingExecutor, refetch: refetchExecutor } = useQuery<
    BuildHistoryState[]
  >(
    [QUERY_KEY.STATUS_REMOTE_BUILD_EXECUTOR, jobId as string],
    () => getStatusRemoteJobBuildExecutor(+(jobId as string)),
    {
      refetchInterval: 3000,
      enabled: Boolean(jobId),
      onError: () => {
        if (!isErrorExecutor) {
          openNotification('error', 'Error', `Failed to response the status of build executor`);
          setErrorExecutor(true);
        }
      },
      onSuccess: () => {
        setErrorExecutor(false);
      },
    }
  );

  return {
    queueData,
    executorData,
    isErrorQueue,
    isErrorExecutor,
  };
}

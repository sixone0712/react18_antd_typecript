import { Modal } from 'antd';
import { useCallback, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { deleteLocalJob, getStatusLocalJob } from '../../lib/api/axios/requests';
import { QUERY_KEY } from '../../lib/api/query/queryKey';
import { PAGE_URL } from '../../lib/constants';
import { openNotification } from '../../lib/util/notification';
import { LoginUserSelector } from '../../reducers/slices/loginUser';
import { JobStepType, JobType, LocalJobStatusState } from '../../types/Job';

export default function useLocalJobStatus() {
  const queryClient = useQueryClient();
  const loggedInUser = useSelector(LoginUserSelector);
  const [isError, setError] = useState(false);
  const history = useHistory();

  const { data, isFetching, refetch } = useQuery<LocalJobStatusState[]>(
    [QUERY_KEY.STATUS_LOCAL_LIST],
    getStatusLocalJob,
    {
      refetchInterval: 3000,
      onError: () => {
        if (!isError) {
          setError(true);
          openNotification('error', 'Error', 'Failed to response local status list');
          queryClient.resetQueries([QUERY_KEY.STATUS_LOCAL_LIST], { exact: true });
        }
      },
      onSuccess: () => {
        setError(false);
      },
    }
  );

  const openDeleteModal = useCallback(
    (jobId: number) => {
      const confirm = Modal.confirm({
        className: 'delete-local-job',
        title: 'Delete Local Job',
        content: 'Are you sure to delete local job?',
        onOk: async () => {
          diableCancelBtn();
          try {
            await deleteLocalJob(jobId);
            openNotification('success', 'Success', 'Succeed to delete local job.');
          } catch (e) {
            openNotification('error', 'Error', 'Failed to delete local job!');
          } finally {
            refetch();
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
    },
    [refetch]
  );

  const moveToHistory = useCallback(
    ({
      type,
      stepType,
      jobId,
      stepId,
      historyId,
    }: {
      type: JobType;
      stepType: JobStepType;
      jobId: number | string;
      stepId: number | string;
      historyId?: string | null;
    }) => {
      history.push(
        PAGE_URL.STATUS_REMOTE_LOCAL_BUILD_HISTORY({
          type,
          stepType,
          jobId,
          stepId,
          historyId,
        })
      );
    },

    [history]
  );

  const moveToAdd = useCallback(() => {
    history.push(PAGE_URL.STATUS_LOCAL_ADD);
  }, [history]);

  return {
    data,
    isFetching,
    isError,
    openDeleteModal,
    loggedInUser,
    moveToAdd,
    moveToHistory,
  };
}

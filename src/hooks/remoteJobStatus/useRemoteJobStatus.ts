import { Modal } from 'antd';
import { useCallback, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useHistory } from 'react-router-dom';
import {
  deleteRemoteJob,
  getStatusRemoteJob,
  getStatusRemoteJobStop,
  startRemoteJob,
  stopRemoteJob,
} from '../../lib/api/axios/requests';
import { QUERY_KEY } from '../../lib/api/query/queryKey';
import { PAGE_URL } from '../../lib/constants';
import { openNotification } from '../../lib/util/notification';
import { LoginUserSelector } from '../../reducers/slices/loginUser';
import useTypedSelector from '../../reducers/useTypedSelector';
import { JobStepType, JobType, RemoteJobStatusState } from '../../types/Job';

export default function useRemoteJobStatus() {
  const history = useHistory();
  const [isError, setError] = useState(false);
  const loggedInUser = useTypedSelector(LoginUserSelector);
  const queryClient = useQueryClient();

  const { data, isFetching, refetch } = useQuery<RemoteJobStatusState[]>(
    [QUERY_KEY.STATUS_REMOTE_LIST],
    getStatusRemoteJob,
    {
      refetchInterval: 3000,
      onError: () => {
        if (!isError) {
          setError(true);
          openNotification('error', 'Error', `Failed to response the status of remote`);
          queryClient.resetQueries([QUERY_KEY.STATUS_REMOTE_LIST], { exact: true });
        }
      },
      onSuccess: () => {
        setError(false);
      },
    }
  );

  const moveToRemoteJobAdd = useCallback(() => {
    history.push(PAGE_URL.STATUS_REMOTE_ADD);
  }, [history]);

  const moveToRemoteJobEdit = useCallback(
    ({ jobId, siteId, jobName }: { jobId: number; siteId: number; jobName: string }) => {
      history.push(PAGE_URL.STATUS_REMOTE_EDIT({ jobId, siteId, jobName }));
    },
    [history]
  );

  const moveToRemoteJobStep = useCallback(
    ({ jobId, jobName }: { jobId: number; jobName: string }) => {
      history.push(PAGE_URL.STATUS_REMOTE_STEP({ jobId, jobName }));
    },
    [history]
  );

  const openStartStopModal = useCallback(
    ({
      action,
      jobId,
      jobName,
      prevStop,
    }: {
      action: 'start' | 'stop';
      jobId: number;
      jobName: string;
      prevStop: boolean;
    }) => {
      const actionText = action === 'start' ? 'Start' : 'End';
      const confirm = Modal.confirm({
        className: `${action}_remote_job`,
        title: `${actionText} Remote Job`,
        content: `Are you sure to ${action} remote job '${jobName}'?`,
        onOk: async () => {
          diableCancelBtn();
          try {
            const { stop } = await getStatusRemoteJobStop(jobId);
            if (prevStop !== stop) {
              openNotification(
                'error',
                'Error',
                `The information of remote job '${jobName}' on the server has been changed. So, run the update. please try again!`
              );
            } else {
              if (action === 'start') await startRemoteJob(jobId);
              else await stopRemoteJob(jobId);
              openNotification('success', 'Success', `Succeed to ${action} remote job '${jobName}'.`);
            }
          } catch (e) {
            openNotification('error', 'Error', `Failed to ${action} remote job '${jobName}'!`);
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

  const openDeleteModal = useCallback(
    ({ jobId, jobName, prevStop }: { jobId: number; jobName: string; prevStop: boolean }) => {
      const confirm = Modal.confirm({
        className: 'delete_remote_job',
        title: 'Delete Remote Job',
        content: `Are you sure to delete remote job '${jobName}'?`,
        onOk: async () => {
          diableCancelBtn();
          try {
            const { stop } = await getStatusRemoteJobStop(jobId);
            if (prevStop !== stop) {
              openNotification(
                'error',
                'Error',
                `The information of remote job '${jobName}' on the server has been changed. So, run the update. please try again!`
              );
            } else {
              if (stop) {
                await deleteRemoteJob(jobId);
                openNotification('success', 'Success', `Succeed to delete remote job '${jobName}'.`);
              } else {
                openNotification('error', 'Error', `After stop remote job '${jobName}', please try again!`);
              }
            }
          } catch (e) {
            openNotification('error', 'Error', `Failed to delete remote job '${jobName}'!`);
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

  const openEditeModal = useCallback(
    ({ jobId, siteId, jobName, prevStop }: { jobId: number; siteId: number; jobName: string; prevStop: boolean }) => {
      let isMoveEdit = false;
      const confirm = Modal.confirm({
        className: 'edit_remote_job',
        title: 'Edit Remote Job',
        content: `Are you sure to edit remote job '${jobName}'?`,
        onOk: async () => {
          diableCancelBtn();
          try {
            const { stop } = await getStatusRemoteJobStop(jobId);

            if (prevStop !== stop) {
              openNotification(
                'error',
                'Error',
                `The information of remote job '${jobName}' on the server has been changed. So, run the update. please try again!`
              );
            } else {
              if (stop) {
                isMoveEdit = true;
              } else {
                openNotification('error', 'Error', `After Stop remote job '${jobName}', please try again!`);
              }
            }
          } catch (e) {
            openNotification('error', 'Error', `Failed to edit remote job '${jobName}'!`);
          } finally {
            if (isMoveEdit) {
              moveToRemoteJobEdit({ jobId, siteId, jobName });
            } else {
              refetch();
            }
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
    [moveToRemoteJobEdit, refetch]
  );

  const moveToHistory = useCallback(
    ({
      type,
      stepType,
      jobId,
      jobName,
      stepId,
      stepName,
      historyId,
    }: {
      type: JobType;
      stepType: JobStepType;
      jobId: number | string;
      jobName: string;
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
          jobName,
          historyId,
        })
      );
    },

    [history]
  );

  return {
    data,
    isFetching,
    isError,
    loggedInUser,
    openStartStopModal,
    openDeleteModal,
    openEditeModal,
    moveToRemoteJobAdd,
    moveToRemoteJobStep,
    moveToHistory,
  };
}

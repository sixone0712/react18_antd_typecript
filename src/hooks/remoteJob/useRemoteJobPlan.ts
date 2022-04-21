import { LabeledValue } from 'antd/lib/select';
import { useCallback, useMemo } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import { getRemoteJobPlans } from '../../lib/api/axios/requests';
import { QUERY_KEY } from '../../lib/api/query/queryKey';
import { openNotification } from '../../lib/util/notification';
import { remoteJobInfoReducer, selectRemoteJobInfo } from '../../reducers/slices/remoteJob';
import useTypedSelector from '../../reducers/useTypedSelector';
import { useSiteList } from '../common/useSiteList';
export function useRemotePlan() {
  const selectJob = useTypedSelector(selectRemoteJobInfo);
  const dispatch = useDispatch();
  const { data: siteList, isFetching: isFetchingSiteList, refetch: refetchSiteList } = useSiteList();
  const queryClient = useQueryClient();

  const setJobName: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      dispatch(remoteJobInfoReducer({ jobName: e.target.value }));
    },
    [dispatch]
  );

  const { data: plans, isFetching: isFetchingPlans, refetch: refetchPlans } = useQuery(
    [QUERY_KEY.JOB_REMOTE_PLANS, selectJob.siteId],
    () => getRemoteJobPlans(selectJob.siteId as number),
    {
      enabled: Boolean(selectJob.siteId),
      onError: () => {
        queryClient.setQueryData([QUERY_KEY.JOB_REMOTE_PLANS, selectJob.siteId], []);
        openNotification('error', 'Error', `Failed to get auto plan list of "${selectJob.siteName}".`);
      },
    }
  );

  const selectSiteInfo = useMemo(
    (): LabeledValue => ({
      key: `${selectJob.siteId}`,
      value: selectJob.siteId as number,
      label: selectJob.siteName,
    }),
    [selectJob.siteId, selectJob.siteName]
  );

  const setSeleteSiteInfo = useCallback(
    ({ value, label }: LabeledValue) => {
      if (selectJob.siteId !== (value as number)) {
        dispatch(
          remoteJobInfoReducer({
            planIds: [],
          })
        );
      }
      dispatch(
        remoteJobInfoReducer({
          siteId: (value as number) ?? null,
          siteName: (label as string) ?? null,
        })
      );
    },
    [dispatch, selectJob.siteId]
  );

  const setSelectPlanIds = useCallback(
    (value: React.Key[]) => {
      dispatch(
        remoteJobInfoReducer({
          planIds: value as number[],
        })
      );
    },
    [dispatch]
  );

  const refreshSiteList = useCallback(() => {
    refetchSiteList();
  }, [refetchSiteList]);

  const refreshPlans = useCallback(() => {
    refetchPlans();
  }, [refetchPlans]);

  return {
    selectJob,
    selectSiteInfo,
    setSeleteSiteInfo,
    setJobName,
    siteList,
    isFetchingSiteList,
    refreshSiteList,
    plans,
    setSelectPlanIds,
    isFetchingPlans,
    refreshPlans,
  };
}

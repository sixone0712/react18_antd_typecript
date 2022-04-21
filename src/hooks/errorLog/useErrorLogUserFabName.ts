import { LabeledValue } from 'antd/lib/select';
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { errorLogSiteInfo, setErrorLogInfoReducer } from '../../reducers/slices/errorLog';
import { useSiteList } from '../common/useSiteList';

export default function useErrorLogUserFabName() {
  const { data: siteList, isFetching: isFetchingSiteList, refetch: refetchSiteList } = useSiteList();
  const siteInfo = useSelector(errorLogSiteInfo);
  const dispatch = useDispatch();

  const refreshSiteList = useCallback(() => {
    refetchSiteList();
  }, [refetchSiteList]);

  const onChangeSiteInfo = useCallback(
    ({ value, label }: LabeledValue) => {
      dispatch(
        setErrorLogInfoReducer({
          siteId: (value as number) ?? null,
          siteName: (label as string) ?? null,
        })
      );
    },
    [dispatch]
  );

  const onClearSiteInfo = useCallback(() => {
    dispatch(
      setErrorLogInfoReducer({
        siteId: null,
        siteName: null,
      })
    );
  }, [dispatch]);

  const selectSiteInfo = useMemo(
    (): LabeledValue => ({
      key: `${siteInfo.siteId}`,
      value: siteInfo.siteId as number,
      label: siteInfo.siteName,
    }),
    [siteInfo]
  );

  return {
    siteList,
    isFetchingSiteList,
    refreshSiteList,
    selectSiteInfo,
    onChangeSiteInfo,
    onClearSiteInfo,
  };
}

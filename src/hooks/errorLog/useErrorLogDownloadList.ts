import { useCallback } from 'react';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { getErrorLogDownloadList } from '../../lib/api/axios/requests';
import { QUERY_KEY } from '../../lib/api/query/queryKey';
import { API_URL } from '../../lib/constants';
import { downloadFileUrl } from '../../lib/util/download';
import { openNotification } from '../../lib/util/notification';
import { errorLogShow, errorLogSiteInfo, setErrorLogShowReducer } from '../../reducers/slices/errorLog';
import { ErrorLogDownloadTable } from '../../types/errorLog';

export default function useErrorLogDownloadList() {
  const dispatch = useDispatch();
  const visible = useSelector(errorLogShow('isDownloadDrawer'));
  const siteInfo = useSelector(errorLogSiteInfo);

  const { data, isFetching, refetch } = useQuery<ErrorLogDownloadTable[]>(
    [QUERY_KEY.ERROR_LOG_DOWNLOAD_LIST, siteInfo.siteId],
    () => getErrorLogDownloadList(siteInfo.siteId as number),
    {
      enabled: visible && !!siteInfo.siteId,
      onError: () => {
        openNotification('error', 'Error', `Failed to get list of error log!`);
      },
    }
  );

  const onClose = useCallback(() => {
    dispatch(
      setErrorLogShowReducer({
        isDownloadDrawer: false,
      })
    );
  }, [dispatch]);

  const onClickDownload = useCallback((id: string) => {
    downloadFileUrl(API_URL.GET_ERROR_LOG_DOWNLOAD_FILE(id));
  }, []);

  const onClickRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return { visible, onClose, data, isFetching, onClickRefresh, onClickDownload };
}

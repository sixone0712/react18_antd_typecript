import { useQuery, useQueryClient } from 'react-query';
import { getStatusSiteList } from '../../lib/api/axios/requests';
import { ResGetSiteName } from '../../lib/api/axios/types';
import { QUERY_KEY } from '../../lib/api/query/queryKey';
import { openNotification } from '../../lib/util/notification';

export function useSiteList() {
  const queryClient = useQueryClient();

  const { data, isFetching, refetch } = useQuery<ResGetSiteName[]>([QUERY_KEY.STATUS_SITE_LIST], getStatusSiteList, {
    onError: () => {
      queryClient.setQueryData([QUERY_KEY.STATUS_SITE_LIST], []);
      openNotification('error', 'Error', `Failed to get user-fab name list.`);
    },
  });

  return {
    data,
    isFetching,
    refetch,
  };
}

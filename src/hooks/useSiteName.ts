// import { useCallback, useMemo } from 'react';
// import { useQuery, useQueryClient } from 'react-query';
// import { useSelector } from 'react-redux';
// import { getStatusSiteList } from '../lib/api/axios/requests';
// import { ResGetSiteName } from '../lib/api/axios/types';
// import { QUERY_KEY } from '../lib/api/query/queryKey';
// import { openNotification } from '../lib/util/notification';
// import { RemoteJobType } from '../pages/Status/Remote/Remote';
// import { remoteJobSelectJob } from '../reducers/slices/remoteJob';

// export default function useSiteName(type: RemoteJobType, notAdded = false) {
//   const { data, isFetching } = useQuery<ResGetSiteName[]>([QUERY_KEY.STATUS_SITE_LIST], getStatusSiteList, {
//     refetchOnWindowFocus: false,
//     // refetchOnMount: false,
//     // refetchOnMount: true,
//     // initialData: [],
//     enabled: type === 'add' && !notAdded,
//     onError: () => {
//       queryClient.setQueryData([QUERY_KEY.STATUS_SITE_LIST], []);
//       openNotification('error', 'Error', `Failed to get site name.`);
//     },
//   });

//   const { data: notAddedData, isFetching: isFetchingNotAdded } = useQuery<ResGetSiteName[]>(
//     [QUERY_KEY.STATUS_SITE_LIST],
//     getStatusSiteList,
//     {
//       refetchOnWindowFocus: false,
//       // refetchOnMount: false,
//       // refetchOnMount: true,
//       // initialData: [],
//       enabled: type === 'add' && notAdded,
//       onError: () => {
//         queryClient.setQueryData([QUERY_KEY.STATUS_SITE_LIST], []);
//         openNotification('error', 'Error', `Failed to get site name.`);
//       },
//     }
//   );
//   const { siteId } = useSelector(remoteJobSelectJob);
//   const queryClient = useQueryClient();

//   const refreshSiteName = useCallback(() => {
//     queryClient.fetchQuery([QUERY_KEY.STATUS_SITE_LIST]);
//   }, [queryClient]);

//   const refreshSiteNameNotAdded = useCallback(() => {
//     queryClient.fetchQuery([QUERY_KEY.STATUS_SITE_LIST_NOT_ADDED_REMOTE_JOB]);
//   }, [queryClient]);

//   const disabledSelectSite = useMemo(() => {
//     if (isFetching) {
//       return true;
//     } else {
//       if (type === 'edit') {
//         return !!siteId;
//       } else {
//         return false;
//       }
//     }
//   }, [siteId, type, isFetching]);

//   const disabledSelectSiteNotAdded = useMemo(() => {
//     if (isFetching) {
//       return true;
//     } else {
//       if (type === 'edit') {
//         return !!siteId;
//       } else {
//         return false;
//       }
//     }
//   }, [siteId, type, isFetching]);

//   return {
//     disabledSelectSite: notAdded ? disabledSelectSiteNotAdded : disabledSelectSite,
//     refreshSiteName: notAdded ? refreshSiteNameNotAdded : refreshSiteName,
//     isFetching: notAdded ? isFetchingNotAdded : isFetching,
//     data: notAdded ? notAddedData : data,
//   };
// }

export default function useSiteName() {}

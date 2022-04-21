import { Modal } from 'antd';
import { useCallback, useMemo } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import {
  deleteSiteDBInfo,
  getSiteDBInfo,
  getSiteJobStatus,
  getStatusRegisteredJobForSite,
} from '../lib/api/axios/requests';
import { SiteDBInfo } from '../lib/api/axios/types';
import { openNotification } from '../lib/util/notification';
import { setSiteInfoDrawer, setSiteInfoDrawerType, setSiteInfoSelectedSite } from '../reducers/slices/configure';

export default function useSiteDBInfoTable() {
  const { data, isFetching } = useQuery<SiteDBInfo[]>('get_config_site_db_info', getSiteDBInfo, {
    refetchOnWindowFocus: false,
    onError: () => {
      openNotification('error', 'Error', 'Failed to response setting database information.');
    },
  });
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const refreshSiteList = useCallback(() => {
    queryClient.fetchQuery('get_config_site_db_info');
  }, [queryClient]);

  const siteListLen = useMemo(() => (data?.length ? data.length : 0), [data?.length]);

  const openAddDrawer = useCallback(() => {
    dispatch(setSiteInfoSelectedSite(undefined));
    dispatch(setSiteInfoDrawerType('add'));
    dispatch(setSiteInfoDrawer(true));
  }, [dispatch]);

  const openEditDrawer = useCallback(
    (selectedSite: SiteDBInfo) => {
      dispatch(setSiteInfoSelectedSite(selectedSite));
      dispatch(setSiteInfoDrawerType('edit'));
      dispatch(setSiteInfoDrawer(true));
    },
    [dispatch]
  );

  const excuteEditModal = useCallback(
    (selectedSite: SiteDBInfo) => {
      const confirm = Modal.confirm({
        className: 'edit-site-setting',
        title: 'Edit Site Information',
        content: `Are you sure to edit a site '${selectedSite.crasCompanyFabName}'?`,
        onOk: async () => {
          diableCancelBtn();

          try {
            const { status } = await getSiteJobStatus(selectedSite.siteId);
            if (status === 'running') {
              openNotification(
                'error',
                'Error',
                `Before editing the site, stop the registered job '${selectedSite.crasCompanyFabName}'!`
              );
              refreshSiteList();
              return;
            }
          } catch (e) {
            openNotification('error', 'Error', `Failed to edit a site '${selectedSite.crasCompanyFabName}'!`);
            refreshSiteList();
          }
          openEditDrawer(selectedSite);
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
    [refreshSiteList, openEditDrawer]
  );

  const excuteEditWarnModal = useCallback((selectedSite: SiteDBInfo) => {
    const confirm = Modal.warning({
      className: 'edit-site-warn-setting',
      title: 'Edit Site Warning',
      content: `After deleting all the jobs registered in '${selectedSite.crasCompanyFabName}', execute Edit again!`,
      onOk: () => {
        diableCancelBtn();
      },
    });

    const diableCancelBtn = () => {
      confirm.update({
        cancelButtonProps: {
          disabled: true,
        },
      });
    };
  }, []);

  const openEditModal = useCallback(
    async (selectedSite: SiteDBInfo) => {
      try {
        const registeredJobs = await getStatusRegisteredJobForSite(selectedSite.siteId);
        if (registeredJobs?.length ?? 0 > 0) {
          excuteEditWarnModal(selectedSite);
        } else {
          excuteEditModal(selectedSite);
        }
      } catch (e) {
        openNotification('error', 'Error', `Failed to get registered job for '${selectedSite.crasCompanyFabName}'!`);
      }
    },
    [excuteEditModal, excuteEditWarnModal]
  );

  const openDeleteModal = useCallback(
    (siteId: number, crasCompanyFabName: string) => {
      const confirm = Modal.confirm({
        className: 'delete-site-setting',
        title: 'Delete Site Information',
        content: `Are you sure to delete a site '${crasCompanyFabName}'?`,
        onOk: async () => {
          diableCancelBtn();

          try {
            const { status } = await getSiteJobStatus(siteId);
            if (status === 'running') {
              openNotification(
                'error',
                'Error',
                `Before deleting the site, stop the registered job '${crasCompanyFabName}'!`
              );
              refreshSiteList();
              return;
            }

            await deleteSiteDBInfo(siteId);
            openNotification('success', 'Success', `Succeed to delete a site '${crasCompanyFabName}'.`);
          } catch (e) {
            openNotification('error', 'Error', `Failed to delete a site '${crasCompanyFabName}'!`);
          } finally {
            refreshSiteList();
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
    [refreshSiteList]
  );

  return {
    isFetchingSiteList: isFetching,
    siteList: data,
    siteListLen,
    refreshSiteList,
    openAddDrawer,
    openEditModal,
    openDeleteModal,
  };
}

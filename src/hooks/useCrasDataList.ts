import { Modal } from 'antd';
import { AxiosError } from 'axios';
import { saveAs } from 'file-saver';
import { useCallback, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { DeleteCrasDeleteSite, getCrasExportFile, getCrasInfoList } from '../lib/api/axios/requests';
import { MUTATION_KEY } from '../lib/api/query/mutationKey';
import { QUERY_KEY } from '../lib/api/query/queryKey';
import { PAGE_URL } from '../lib/constants';
import { openNotification } from '../lib/util/notification';
import {
  initCrasReducer,
  setCrasAddVisibleReducer,
  setCrasIdReducer,
  setCrasImportVisibleReducer,
} from '../reducers/slices/crasData';
import { CrasDataInfo } from '../types/crasData';
export default function useCrasDataList() {
  const history = useHistory();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const { data: list, isFetching: isFetching, refetch: refetchList } = useQuery<CrasDataInfo[], AxiosError>(
    [QUERY_KEY.RULES_CRAS_LIST],
    () => getCrasInfoList(),
    {
      initialData: [],
      placeholderData: [],
      refetchOnWindowFocus: false,
      onError: (error: AxiosError) => {
        openNotification('error', 'Error', `Failed to response the list of cras data!`, error);
      },
    }
  );

  const { mutateAsync: deleteMutateAsync, isLoading: isDeleting } = useMutation(
    (id: number) => DeleteCrasDeleteSite(id),
    {
      mutationKey: MUTATION_KEY.RULES_CRAS_DELETE,
      onError: (error: AxiosError) => {
        openNotification('error', 'Error', `Failed to delete cras data!`, error);
      },
      onSuccess: () => {
        openNotification('success', 'Success', 'Succeed to delete cras data');
      },
      onSettled: () => {
        //refetchList();
        queryClient.invalidateQueries([QUERY_KEY.RULES_CRAS_LIST], { exact: true });
      },
    }
  );

  const openDeleteModal = useCallback(
    (id: number) => {
      const confirm = Modal.confirm({
        className: 'edit-cras-data',
        title: 'Delete Cras Data',
        content: 'Are you sure to delete cras data?',
        onOk: async () => {
          await deleteMutateAsync(id);
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
    [deleteMutateAsync]
  );

  const openImportModal = (id: number) => {
    dispatch(setCrasIdReducer(+id ?? undefined));
    dispatch(setCrasImportVisibleReducer(true));
  };

  const openExportModal = (id: number) => {
    const confirm = Modal.confirm({
      className: 'export-cras-data',
      title: 'Export Cras Data',
      content: 'Are you sure to export cras data?',
      onOk: async () => {
        diableCancelBtn();
        try {
          const { data, fileName } = await getCrasExportFile(id);
          saveAs(data, fileName);
          openNotification('success', 'Success', `Succeed to export cras data '${fileName}'.`);
        } catch (e) {
          console.error(e);
          openNotification('error', 'Error', 'Failed to export cras data!');
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
  };

  const openEditModal = useCallback(
    (type: 'create' | 'judge', id: number, siteName: string) => {
      if (type === 'create') {
        history.push(`${PAGE_URL.RULES_CRAS_DATA_EDIT_CREATE(id, siteName)}`);
      } else {
        history.push(`${PAGE_URL.RULES_CRAS_DATA_EDIT_JUDGE(id, siteName)}`);
      }
    },
    [history]
  );

  const openAddModal = () => {
    dispatch(setCrasAddVisibleReducer(true));
  };
  const refreshStatusList = () => {
    queryClient.fetchQuery([QUERY_KEY.RULES_CRAS_LIST]);
  };

  useEffect(() => {
    dispatch(initCrasReducer());
  }, []);

  return {
    list,
    openDeleteModal,
    openImportModal,
    openExportModal,
    openEditModal,
    openAddModal,
    isFetching,
    refreshStatusList,
  };
}

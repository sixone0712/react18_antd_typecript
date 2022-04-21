import { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { postErrorLogImport } from '../../lib/api/axios/requests';
import { MUTATION_KEY } from '../../lib/api/query/mutationKey';
import { QUERY_KEY } from '../../lib/api/query/queryKey';
import { openNotification } from '../../lib/util/notification';
import { errorLogShow, errorLogSiteInfo, setErrorLogShowReducer } from '../../reducers/slices/errorLog';

export default function useErrorLogImport() {
  const visible = useSelector(errorLogShow('isImportModal'));
  const { siteId } = useSelector(errorLogSiteInfo);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [importFile, setImportFile] = useState<File | undefined>(undefined);

  const setVisible = useCallback(
    (value: boolean) => {
      dispatch(
        setErrorLogShowReducer({
          isImportModal: value,
        })
      );
    },
    [dispatch]
  );

  const { mutate: mutateImportFile, isLoading: isImporting } = useMutation(
    ({ id, formData }: { id: number; formData: FormData }) => postErrorLogImport(id, formData),
    {
      mutationKey: MUTATION_KEY.ERROR_LOG_IMPORT,
      onError: (error: AxiosError) => {
        openNotification('error', 'Error', `Failed to import error log setting file!`, error);
      },
      onSuccess: () => {
        openNotification('success', 'Success', 'Succeed to import error log setting file');
      },
      onSettled: () => {
        queryClient.invalidateQueries([QUERY_KEY.ERROR_LOG_LIST], {
          exact: true,
        });
        queryClient.invalidateQueries([QUERY_KEY.ERROR_LOG_SETTING_LIST], {
          exact: true,
        });
        setVisible(false);
      },
    }
  );

  const handleOk = useCallback(async () => {
    const formData = new FormData();
    formData.append('file', importFile as File);
    mutateImportFile({ id: siteId as number, formData });
  }, [mutateImportFile, siteId, importFile]);

  const handleCancel = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  useEffect(() => {
    if (visible) {
      setImportFile(undefined);
    }
  }, [visible]);

  return {
    visible,
    setVisible,
    importFile,
    setImportFile,
    isImporting,
    handleOk,
    handleCancel,
  };
}

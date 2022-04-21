import { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { postConvertImportFile } from '../lib/api/axios/requests';
import { MUTATION_KEY } from '../lib/api/query/mutationKey';
import { QUERY_KEY } from '../lib/api/query/queryKey';
import { openNotification } from '../lib/util/notification';
import { convertShowImportSelector, setConvertShowImportReducer } from '../reducers/slices/convert';
import { setCrasIdReducer } from '../reducers/slices/crasData';

export default function useConvertImport() {
  const visible = useSelector(convertShowImportSelector);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [importFile, setImportFile] = useState<File | undefined>(undefined);

  const setVisible = useCallback(
    (value: boolean) => {
      dispatch(setConvertShowImportReducer(value));
    },
    [dispatch]
  );

  const { mutate: mutateImportFile, isLoading: isImporting } = useMutation(
    (formData: FormData) => postConvertImportFile(formData),
    {
      mutationKey: MUTATION_KEY.RULES_CONVERT_IMPORT_FILE,
      onError: (error: AxiosError) => {
        openNotification('error', 'Error', `Failed to import convert rules file!`, error);
      },
      onSuccess: () => {
        openNotification('success', 'Success', 'Succeed to import convert rules file');
      },
      onSettled: () => {
        queryClient.invalidateQueries([QUERY_KEY.RULES_CONVERT_LIST], {
          exact: true,
        });
        queryClient.invalidateQueries([QUERY_KEY.STATUS_SITE_LIST], {
          exact: true,
        });
        setVisible(false);
      },
    }
  );

  const handleOk = useCallback(async () => {
    const formData = new FormData();
    formData.append('file', importFile as File);
    mutateImportFile(formData);
  }, [mutateImportFile, importFile]);

  const handleCancel = useCallback(() => {
    dispatch(setCrasIdReducer(undefined));
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

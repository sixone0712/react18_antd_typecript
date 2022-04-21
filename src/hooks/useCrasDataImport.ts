import { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { postCrasImportFile } from '../lib/api/axios/requests';
import { MUTATION_KEY } from '../lib/api/query/mutationKey';
import { QUERY_KEY } from '../lib/api/query/queryKey';
import { openNotification } from '../lib/util/notification';
import {
  crasIdSelector,
  crasShowImportSelector,
  setCrasIdReducer,
  setCrasImportVisibleReducer,
} from '../reducers/slices/crasData';

export default function useCrasDataImport() {
  const visible = useSelector(crasShowImportSelector);
  const selectId = useSelector(crasIdSelector);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [importFile, setImportFile] = useState<File | undefined>(undefined);

  const setVisible = useCallback(
    (value: boolean) => {
      dispatch(setCrasImportVisibleReducer(value));
    },
    [dispatch]
  );

  const { mutate: mutateImportFile, isLoading: isImporting } = useMutation(
    ({ id, formData }: { id: number; formData: FormData }) => postCrasImportFile(id, formData),
    {
      mutationKey: MUTATION_KEY.RULES_CRAS_IMPORT_FILE,
      onError: (error: AxiosError) => {
        openNotification('error', 'Error', `Failed to import cras data file!`, error);
      },
      onSuccess: () => {
        openNotification('success', 'Success', 'Succeed to import cras data file');
      },
      onSettled: () => {
        queryClient.invalidateQueries([QUERY_KEY.RULES_CRAS_LIST], {
          exact: true,
        });
        dispatch(setCrasIdReducer(undefined));
        setVisible(false);
      },
    }
  );

  const handleOk = useCallback(async () => {
    const formData = new FormData();
    formData.append('file', importFile as File);
    mutateImportFile({ id: selectId as number, formData });
  }, [mutateImportFile, selectId, importFile]);

  const handleCancel = useCallback(() => {
    dispatch(setCrasIdReducer(undefined));
    setVisible(false);
  }, [setVisible]);

  useEffect(() => {
    if (visible) {
      console.log('visible true');
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

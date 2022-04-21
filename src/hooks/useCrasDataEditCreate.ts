import { useForm } from 'antd/lib/form/Form';
import { SelectValue } from 'antd/lib/select';
import { PresetStatusColorType } from 'antd/lib/_util/colors';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCrasManualCreateInfoDetail,
  getCrasManualCreateTargetColumn,
  getCrasManualCreateTargetTable,
  postCrasManualCreateAdd,
  postCrasManualCreateTestQuery,
  putCrasManualCreateEdit,
} from '../lib/api/axios/requests';
import { ReqPostCrasDataCreateAdd, ReqPostCrasDataTestQuery, ReqPutCrasDataCreateEdit } from '../lib/api/axios/types';
import { MUTATION_KEY } from '../lib/api/query/mutationKey';
import { QUERY_KEY } from '../lib/api/query/queryKey';
import { openNotification } from '../lib/util/notification';
import {
  crasCreateOptionSelector,
  crasCreateTableSelector,
  crasDrawerTypeSelector,
  crasIdSelector,
  crasItemIdSelector,
  crasShowCreateDrawerSelector,
  setCrasCreateColumnTableOption,
  setCrasCreateSelectTable,
  setCrasCreateTargetTableOption,
  setCrasShowCreateDrawerReducer,
} from '../reducers/slices/crasData';
import { CrasDataCreateInfo } from '../types/crasData';

export interface FormCrasDataCreateInfo extends Omit<CrasDataCreateInfo, 'itemId'> {}

export interface TestQueryStatusInfo {
  status: PresetStatusColorType;
  error: string;
}
export default function useCrasDataEditCreate() {
  const queryClient = useQueryClient();
  const [form] = useForm<FormCrasDataCreateInfo>();
  const dispatch = useDispatch();
  const isDrawer = useSelector(crasShowCreateDrawerSelector);
  const drawerType = useSelector(crasDrawerTypeSelector);
  const selectId = useSelector(crasIdSelector);
  const selectItemId = useSelector(crasItemIdSelector);
  const selectTable = useSelector(crasCreateTableSelector);
  const createOptions = useSelector(crasCreateOptionSelector);
  const [testQueryStatus, setTestQueryStatus] = useState<TestQueryStatusInfo>({
    status: 'default',
    error: '',
  });

  const { data: itemInfo, isFetching: isFetchingItems, refetch: refetchingItems } = useQuery<
    CrasDataCreateInfo,
    AxiosError
  >(
    [QUERY_KEY.RULES_CRAS_MANUAL_CREATE_DETAIL, selectId, selectItemId],
    () => getCrasManualCreateInfoDetail(selectId as number, selectItemId as number),

    {
      enabled: drawerType === 'edit' && isDrawer && Boolean(selectId) && Boolean(selectItemId),
      refetchOnWindowFocus: false,
      onError: (error: AxiosError) => {
        openNotification('error', 'Error', `Failed to response the list of create cras data item`, error);
      },
      onSuccess: (resData) => {
        form.setFieldsValue({
          ...resData,
        });
        dispatch(setCrasCreateSelectTable(resData.targetTable));
      },
    }
  );

  const { data: targetTableList, isFetching: isFetchingTargetTable } = useQuery<string[], AxiosError>(
    [QUERY_KEY.RULES_CRAS_MANUAL_CREATE_TARGET_TABLE_LIST, selectId],
    () => getCrasManualCreateTargetTable(selectId as number),
    {
      enabled: isDrawer && Boolean(selectId),
      refetchOnWindowFocus: false,
      onError: (error: AxiosError) => {
        openNotification('error', 'Error', `Failed to response the list of target table!`, error);
        dispatch(setCrasCreateTargetTableOption([]));
      },
      onSuccess: (resData) => {
        dispatch(setCrasCreateTargetTableOption(resData));
      },
    }
  );

  const { data: columnTableList, isFetching: isFetchingTargetColumn } = useQuery<string[], AxiosError>(
    [QUERY_KEY.RULES_CRAS_MANUAL_CREATE_TARGET_COLUMN_LIST, selectId, selectTable],
    () => getCrasManualCreateTargetColumn(selectId as number, selectTable as string),
    {
      enabled: isDrawer && Boolean(selectId) && Boolean(selectTable),
      refetchOnWindowFocus: false,
      onError: (error: AxiosError) => {
        openNotification('error', 'Error', `Failed to response the list of target table!`, error);
        dispatch(setCrasCreateColumnTableOption([]));
      },
      onSuccess: (resData) => {
        dispatch(setCrasCreateColumnTableOption(resData));
      },
    }
  );

  const { mutate: testQueryMutate, isLoading: isTestQuerying } = useMutation(
    (postData: ReqPostCrasDataTestQuery) => postCrasManualCreateTestQuery(postData),
    {
      mutationKey: MUTATION_KEY.RULES_CRAS_CREATE_TEST_QUERY,
      onError: (error: AxiosError) => {
        setTestQueryStatus({ status: 'error', error: error.message });
      },
      onSuccess: () => {
        setTestQueryStatus({ status: 'success', error: '' });
      },
    }
  );

  const { mutate: addMutate, isLoading: isAdding } = useMutation(
    ({ id, postData }: { id: number; postData: ReqPostCrasDataCreateAdd }) => postCrasManualCreateAdd(id, postData),
    {
      mutationKey: MUTATION_KEY.RULES_CRAS_CREATE_ADD,
      onError: (error: AxiosError) => {
        openNotification('error', 'Error', `Failed to add cras create data!`, error);
      },
      onSuccess: () => {
        openNotification('success', 'Success', 'Succeed to add cras create data.');
      },
      onSettled: () => {
        //queryClient.fetchQuery([QUERY_KEY.RULES_CRAS_GET_MANUAL_CREATE, selectId]);
        queryClient.invalidateQueries([QUERY_KEY.RULES_CRAS_MANUAL_CREATE_LIST, selectId], {
          exact: true,
        });
        dispatch(setCrasShowCreateDrawerReducer(false));
      },
    }
  );
  const { mutate: editMutate, isLoading: isEditing } = useMutation(
    ({ id, itemId, postData }: { id: number; itemId: number; postData: ReqPutCrasDataCreateEdit }) =>
      putCrasManualCreateEdit(id, itemId, postData),
    {
      mutationKey: MUTATION_KEY.RULES_CRAS_CREATE_EDIT,
      onError: (error: AxiosError) => {
        openNotification('error', 'Error', `Failed to edit cras create data!`, error);
      },
      onSuccess: () => {
        openNotification('success', 'Success', 'Succeed to edit create cras data.');
      },
      onSettled: () => {
        //queryClient.fetchQuery([QUERY_KEY.RULES_CRAS_GET_MANUAL_CREATE, selectId]);
        queryClient.invalidateQueries([QUERY_KEY.RULES_CRAS_MANUAL_CREATE_LIST, selectId], {
          exact: true,
        });
        dispatch(setCrasShowCreateDrawerReducer(false));
      },
    }
  );

  const isDisableItems = useMemo(
    () => isFetchingItems || isTestQuerying || isAdding || isEditing || isFetchingTargetTable || isFetchingTargetColumn,

    [isFetchingItems, isTestQuerying, isAdding, isEditing, isFetchingTargetTable, isFetchingTargetColumn]
  );

  const closeDrawer = () => {
    dispatch(setCrasShowCreateDrawerReducer(false));
  };

  const onSelectTargetTable = useCallback((value: SelectValue) => {
    dispatch(setCrasCreateSelectTable(value as string));
  }, []);

  const onChangeTargetColumn = useCallback(
    (value: string[]) => {
      if (form.getFieldValue('targetCol').length > 2) {
        value.pop();
        form.setFieldsValue({
          targetCol: value,
        });
      }
    },
    [form]
  );

  const onFinish = useCallback(() => {
    const reqData = form.getFieldsValue();
    if (drawerType === 'add') {
      selectId && addMutate({ id: selectId, postData: reqData });
    } else {
      selectId && selectItemId && editMutate({ id: selectId, itemId: selectItemId, postData: reqData });
    }
  }, [drawerType, selectId, selectItemId, addMutate, editMutate]);

  const testQuery = async () => {
    try {
      const { manualWhere, targetCol, targetTable } = await form.validateFields([
        'targetTable',
        'targetCol',
        'manualWhere',
      ]);
      setTestQueryStatus({ status: 'processing', error: '' });
      testQueryMutate({ id: selectId as number, manualWhere, targetCol, targetTable });
    } catch (e) {
      console.error(e);
      setTestQueryStatus({ status: 'default', error: '' });
    }
  };

  const initData = useCallback(() => {
    if (drawerType === 'add') {
      form.resetFields();
      form.setFieldsValue({ enable: true });
    }
    setTestQueryStatus({ status: 'default', error: '' });
  }, [drawerType, form]);

  useEffect(() => {
    if (isDrawer) {
      initData();
    }
  }, [isDrawer]);

  return {
    form,
    drawerType,
    isDrawer,
    closeDrawer,
    onFinish,
    initData,
    createOptions,
    onSelectTargetTable,
    onChangeTargetColumn,
    isDisableItems,
    isFetchingItems,
    isTestQuerying,
    isAdding,
    isEditing,
    isFetchingTargetTable,
    isFetchingTargetColumn,
    selectTable,
    testQuery,
    testQueryStatus,
  };
}

import { useForm } from 'antd/lib/form/Form';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { postConvertAddLog } from '../lib/api/axios/requests';
import { ResGetSiteName } from '../lib/api/axios/types';
import { MUTATION_KEY } from '../lib/api/query/mutationKey';
import { QUERY_KEY } from '../lib/api/query/queryKey';
import { openNotification } from '../lib/util/notification';
import { convertShowAddSelector, setConvertShowAddReducer } from '../reducers/slices/convert';

export interface FormAddConvert {
  log_name: string;
  select: number[];
  rule_type: string;
  tag: string[];
  ignore: string[];
  table_name: string;
  retention: number;
}

export default function useConvertAdd() {
  const [form] = useForm<FormAddConvert>();
  const [isRetention, setIsRetention] = useState(false);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const visible = useSelector(convertShowAddSelector);
  const setVisible = useCallback(
    (visible: boolean) => {
      dispatch(setConvertShowAddReducer(visible));
    },
    [dispatch]
  );
  const [tag, setTagArr] = useState<string[]>([]);
  const [ignore, setIgnoreArr] = useState<string[]>([]);

  const setTag = useCallback(
    (tag: string[]) => {
      setTagArr(tag);
      form.setFieldsValue({
        tag,
      });
    },
    [form]
  );

  const setIgnore = useCallback(
    (ignore: string[]) => {
      setIgnoreArr(ignore);
      form.setFieldsValue({
        ignore,
      });
    },
    [form]
  );

  const siteNameList = queryClient.getQueryData<ResGetSiteName[]>([QUERY_KEY.STATUS_SITE_LIST]);

  const { mutate: mutateAdd, isLoading: isFetchingAdd } = useMutation(
    (reqData: FormAddConvert) => postConvertAddLog(reqData),
    {
      mutationKey: MUTATION_KEY.RULES_CONVERT_ADD_LOG,
      onError: (error: AxiosError) => {
        openNotification('error', 'Error', `Failed to add convert log!`, error);
        setVisible(false);
      },
      onSuccess: () => {
        queryClient.invalidateQueries([QUERY_KEY.STATUS_SITE_LIST], { exact: true });
        queryClient.invalidateQueries([QUERY_KEY.RULES_CONVERT_LIST], { exact: true });
        setVisible(false);
      },
    }
  );

  const handleOk = useCallback(
    (reqData: FormAddConvert) => {
      if (!reqData.retention) {
        reqData.retention = 0;
      }
      mutateAdd(reqData);
    },
    [mutateAdd]
  );

  const handleCancel = useCallback(() => {
    setVisible(false);
  }, []);

  const setRetention = useCallback(
    (checked: boolean, event: MouseEvent) => {
      setIsRetention(checked);
      form.setFieldsValue({
        retention: undefined,
      });
    },
    [form]
  );

  useEffect(() => {
    if (visible) {
      form.resetFields();
      setTagArr([]);
      setIgnoreArr([]);
      setIsRetention(false);
    }
  }, [visible]);

  return {
    form,
    visible,
    setVisible,
    siteNameList,
    isFetchingAdd,
    handleOk,
    handleCancel,
    tag,
    setTag,
    ignore,
    setIgnore,
    isRetention,
    setRetention,
  };
}

import { useForm } from 'antd/lib/form/Form';
import { LabeledValue } from 'antd/lib/select';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { getConvertItem, getConvertRuleList, patchConvertEditLog } from '../lib/api/axios/requests';
import { ResGetSiteName } from '../lib/api/axios/types';
import { MUTATION_KEY } from '../lib/api/query/mutationKey';
import { QUERY_KEY } from '../lib/api/query/queryKey';
import { openNotification } from '../lib/util/notification';
import {
  convertLogNameIdSelector,
  convertShowEditSelector,
  setConvertShowEditReducer,
} from '../reducers/slices/convert';
import { ConvertRuleItem, ReqEditLogName, RuleInfo } from '../types/convertRules';

export interface FormEditConvertModal {
  log_name: string;
  table_name: string;
  rule_type: LabeledValue;
  rule_list: number[];
  tag: string[];
  ignore: string[];
  select: number[];
  retention: number;
}

export default function useConvertEditModal() {
  const [form] = useForm<FormEditConvertModal>();
  const [isRetention, setIsRetention] = useState(false);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const visible = useSelector(convertShowEditSelector);
  const log_name_id = useSelector(convertLogNameIdSelector);
  const setVisible = useCallback(
    (visible: boolean) => {
      dispatch(setConvertShowEditReducer(visible));
    },
    [dispatch]
  );
  const [tag, setTagArr] = useState<string[]>([]);
  const [ignore, setIgnoreArr] = useState<string[]>([]);

  const setTag = useCallback(
    (tag: string[]) => {
      setTagArr(tag);
      form.setFieldsValue({
        tag: tag,
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

  const { mutate: mutateEdit, isLoading: isFetchingEdit } = useMutation(
    ({ id, data }: { id: number; data: ReqEditLogName }) => patchConvertEditLog(id, data),
    {
      mutationKey: MUTATION_KEY.RULES_CONVERT_EDIT_LOG,
      onError: (error: AxiosError) => {
        openNotification('error', 'Error', `Failed to add convert log!`, error);
        setVisible(false);
      },
      onSuccess: () => {
        queryClient.invalidateQueries([QUERY_KEY.RULES_CONVERT_LIST], { exact: true });
        setVisible(false);
      },
    }
  );

  const { data: convertItem, isFetching: isFetchingConvertItem, refetch: refetchConvertItem } = useQuery<
    ConvertRuleItem,
    AxiosError
  >([QUERY_KEY.RULES_CONVERT_ITEM], () => getConvertItem(log_name_id as number), {
    enabled: log_name_id !== undefined && visible,
    onError: (error: AxiosError) => {
      openNotification('error', 'Error', `Failed to response the conver rule`, error);
    },
    onSuccess: (resData: ConvertRuleItem) => {
      const { log_name, select, rule_type, table_name, tag, retention, ignore } = resData;
      let ruleTypeValue: LabeledValue | undefined;
      if (rule_type === 'csv') {
        ruleTypeValue = {
          key: rule_type,
          value: rule_type,
          label: 'CSV',
        };
      } else if (rule_type === 'regex') {
        ruleTypeValue = {
          key: rule_type,
          value: rule_type,
          label: 'Regular Expression',
        };
      }
      form.setFieldsValue({
        log_name,
        select: select ?? [],
        rule_type: ruleTypeValue,
        table_name,
        tag: tag ?? [],
        ignore: ignore ?? [],
        retention: retention && retention > 0 ? retention : undefined,
      });
      setIsRetention(retention && retention > 0 ? true : false);
      setTag(tag ?? []);
      setIgnore(ignore ?? []);
    },
  });

  const { data: ruleList, isFetching: isFetchingRuleList, refetch: refetchRuleList } = useQuery<RuleInfo[], AxiosError>(
    [QUERY_KEY.RULES_CONVERT_RULE_LIST],
    () => getConvertRuleList(log_name_id as number),
    {
      initialData: [],
      enabled: log_name_id !== undefined && visible,
      onError: (error: AxiosError) => {
        openNotification('error', 'Error', `Failed to response the list of convert rule list`, error);
      },
      onSuccess: (resData: RuleInfo[]) => {
        form.setFieldsValue({
          rule_list: resData?.map((item) => item.id) ?? undefined,
        });
      },
    }
  );

  const handleOk = useCallback(
    (reqData: FormEditConvertModal) => {
      mutateEdit({
        id: log_name_id as number,
        data: {
          log_name: reqData.log_name,
          table_name: reqData.table_name,
          rule_type: reqData.rule_type.value as string,
          rule_list: reqData.rule_list ?? [],
          select: reqData.select ?? [],
          ignore: reqData.ignore ?? [],
          tag: reqData.tag ?? [],
          retention: reqData.retention ?? 0,
        },
      });
    },
    [mutateEdit, log_name_id]
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
    ruleList,
    isFetchingEdit,
    isFecthingBase: isFetchingConvertItem || isFetchingRuleList,
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

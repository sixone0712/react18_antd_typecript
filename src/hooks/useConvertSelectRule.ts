import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { FormInstance } from 'antd/lib/form/Form';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { getConvertItem, getConvertRuleItem, getConvertRuleList, getStatusSiteList } from '../lib/api/axios/requests';
import { ResGetSiteName } from '../lib/api/axios/types';
import { QUERY_KEY } from '../lib/api/query/queryKey';
import { setResConvertData } from '../lib/util/convertRule';
import { openNotification } from '../lib/util/notification';
import {
  convertLogNameIdSelector,
  convertNewRuleSelector,
  convertRuleIdSelector,
  convertRuleTypeSelector,
  setConvertInfo,
  setConvertInfoConvert,
} from '../reducers/slices/convert';
import { BaseRule, ConvertRuleItem, RuleInfo } from '../types/convertRules';
import { FormConvertSelectRule } from './useConvertEdit';
import useUploadFiles from './useUploadFiles';

export type useConvertSelectRuleProps = {
  form: FormInstance<FormConvertSelectRule>;
};
export default function useConvertSelectRule({ form }: useConvertSelectRuleProps) {
  const dispatch = useDispatch();
  const { uploadFiles, setUploadFiles } = useUploadFiles();
  const log_name_id = useSelector(convertLogNameIdSelector);
  const newRule = useSelector(convertNewRuleSelector);
  const rule_id = useSelector(convertRuleIdSelector);
  const rule_type = useSelector(convertRuleTypeSelector);
  const readyReqRuleItem = useRef(false);

  const { data: convertItem, isFetching: isFetchingConvertItem, refetch: refetchConvertItem } = useQuery<
    ConvertRuleItem,
    AxiosError
  >([QUERY_KEY.RULES_CONVERT_ITEM], () => getConvertItem(log_name_id as number), {
    enabled: log_name_id !== undefined,
    onError: (error: AxiosError) => {
      openNotification('error', 'Error', `Failed to response the conver rule`, error);
    },
    onSuccess: (resData: ConvertRuleItem) => {
      const { log_name, select, rule_type, table_name, filter } = resData;
      dispatch(
        setConvertInfo({
          log_name,
          select: select ?? [],
          rule_type: rule_type as 'csv' | 'regex',
          table_name,
          filter: filter.map((item, idx) => ({ ...item, index: idx })) ?? [],
        })
      );

      form.setFieldsValue({
        log_name,
        table_name,
        rule_type: rule_type === 'csv' ? 'CSV' : rule_type === 'regex' ? 'Regular Expression' : undefined,
      });
    },
  });

  const { data: siteNameList, isFetching: isFetchingSiteNameList, refetch: refetchSiteNameList } = useQuery<
    ResGetSiteName[],
    AxiosError
  >([QUERY_KEY.STATUS_SITE_LIST], getStatusSiteList, {
    initialData: [],
    onError: (error: AxiosError) => {
      openNotification('error', 'Error', `Failed to response the list of user-fab name list`, error);
    },
  });

  const { data: ruleList, isFetching: isFetchingRuleList, refetch: refetchRuleList } = useQuery<RuleInfo[], AxiosError>(
    [QUERY_KEY.RULES_CONVERT_RULE_LIST],
    () => getConvertRuleList(log_name_id as number),
    {
      initialData: [],
      enabled: log_name_id !== undefined,
      onError: (error: AxiosError) => {
        openNotification('error', 'Error', `Failed to response the list of convert rule list`, error);
      },
    }
  );

  const { data: ruleItem, isFetching: isFetchingRuleItem, refetch: refetchRuleItem } = useQuery<BaseRule, AxiosError>(
    [QUERY_KEY.RULES_CONVERT_RULE_ITEM, log_name_id, rule_id],
    ({ queryKey }) => {
      const [_key, logNameId, ruleId] = queryKey as [string, string, string];
      return getConvertRuleItem(+logNameId as number, +ruleId as number);
    },
    {
      enabled: false,
      onError: (error: AxiosError) => {
        openNotification('error', 'Error', `Failed to response the convert rule item`, error);
      },
      onSuccess: (resData: BaseRule) => {
        dispatch(
          setConvertInfo({
            // filter: resData.filter ?? [],
            columns: resData.columns
              ? [
                  ...resData.columns,
                  {
                    column_name: 'custom',
                    data_type: null,
                  },
                ]
              : [],
          })
        );
        dispatch(setConvertInfoConvert(setResConvertData(resData)));
      },
    }
  );

  const onChangeRuleName = useCallback(() => {
    const value = form.getFieldValue('select_rule');
    const findRule = ruleList?.find((item) => item.id === value);
    if (findRule) {
      dispatch(
        setConvertInfo({
          rule_name: findRule.rule_name,
          edit_rule_name: findRule.rule_name,
          new_rule: false,
          rule_id: findRule.id,
        })
      );
      form.setFieldsValue({
        is_new_rule: false,
      });
      readyReqRuleItem.current = true;
    }
  }, [form, dispatch, ruleList, readyReqRuleItem]);

  const onChangeNewRule = useCallback(
    (e: CheckboxChangeEvent) => {
      dispatch(
        setConvertInfo({
          new_rule: e.target.checked,
        })
      );
      if (e.target.checked) {
        const filterData = convertItem?.filter;
        form.setFieldsValue({
          select_rule: undefined,
        });
        dispatch(
          setConvertInfo({
            rule_name: undefined,
            rule_id: undefined,
            edit_rule_name: undefined,
            rule_base: undefined,
            columns: [],
            filter: filterData?.map((item, idx) => ({ ...item, index: idx })) ?? [],
          })
        );
        dispatch(
          setConvertInfoConvert({
            info: [],
            header: [],
            custom: [],
          })
        );
      }
    },
    [form, convertItem, dispatch]
  );

  const isFetchingBaseData = useMemo(() => isFetchingConvertItem || isFetchingSiteNameList || isFetchingRuleList, [
    isFetchingConvertItem,
    isFetchingSiteNameList,
    isFetchingRuleList,
  ]);

  const disabledRegexAdd = useMemo(() => {
    if (rule_type === 'regex' && ruleList && ruleList.length > 0) {
      return true;
    } else {
      return false;
    }
  }, [rule_type, ruleList]);

  useEffect(() => {
    if (readyReqRuleItem.current) {
      if (rule_id) {
        readyReqRuleItem.current = false;
        refetchRuleItem();
      }
    }
  }, [readyReqRuleItem, rule_id]);

  return {
    uploadFiles,
    setUploadFiles,
    ruleList,
    onChangeRuleName,
    onChangeNewRule,
    newRule,
    isFetchingBaseData,
    isFetchingRuleItem,
    disabledRegexAdd,
  };
}

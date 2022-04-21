import { FormInstance } from 'antd';
import { AxiosError } from 'axios';
import { ChangeEventHandler, useCallback, useEffect, useRef } from 'react';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useDebouncedCallback } from 'use-debounce/lib';
import { getConvertBaseRule, getConvertRuleList } from '../lib/api/axios/requests';
import { QUERY_KEY } from '../lib/api/query/queryKey';
import { setResConvertData } from '../lib/util/convertRule';
import { openNotification } from '../lib/util/notification';
import {
  convertEditRuleNameSelector,
  convertLogNameIdSelector,
  convertLogNameSelector,
  convertNewRuleSelector,
  convertRuleBaseSelector,
  convertRuleTypeSelector,
  convertTableNameSelector,
  setConvertInfo,
  setConvertInfoConvert,
} from '../reducers/slices/convert';
import { BaseRule, RuleInfo } from '../types/convertRules';
import { FormConvertHeadersColumns } from './useConvertEdit';

export type useConvertLogProps = {
  form: FormInstance<FormConvertHeadersColumns>;
};

export default function useConvertLog({ form }: useConvertLogProps) {
  const dispatch = useDispatch();
  const newRule = useSelector(convertNewRuleSelector);
  const log_name_id = useSelector(convertLogNameIdSelector);
  const log_name = useSelector(convertLogNameSelector);
  const edit_rule_name = useSelector(convertEditRuleNameSelector);
  const table_name = useSelector(convertTableNameSelector);
  const rule_base = useSelector(convertRuleBaseSelector);
  const rule_type = useSelector(convertRuleTypeSelector);
  const readyReqRuleBaseRef = useRef<boolean>(false);

  const { data: ruleList, isFetching: isFetchingRuleList, refetch: refetchRuleList } = useQuery<RuleInfo[], AxiosError>(
    [QUERY_KEY.RULES_CONVERT_RULE_LIST, log_name_id],
    () => getConvertRuleList(log_name_id as number),
    {
      initialData: [],
      enabled: log_name_id !== undefined,
      onError: (error: AxiosError) => {
        openNotification('error', 'Error', `Failed to response the list of convert rule list`, error);
      },
    }
  );

  const { data: baseRule, isFetching: isFetchingBaseRule, refetch: refetchBaseRule } = useQuery<BaseRule, AxiosError>(
    [QUERY_KEY.RULES_CONVERT_RULE_BASE, log_name_id, rule_base],
    ({ queryKey }) => {
      const [_key, logNameId, baseRuleId] = queryKey as [string, string, string];
      return getConvertBaseRule(+logNameId as number, +baseRuleId as number);
    },
    {
      enabled: false,
      onError: (error: AxiosError) => {
        dispatch(setConvertInfo({ select_info_row: undefined, select_header_row: undefined }));
        openNotification('error', 'Error', `Failed to response the convert base rule!`, error);
      },
      onSuccess: (resData: BaseRule) => {
        dispatch(
          setConvertInfo({
            select_info_row: undefined,
            select_header_row: undefined,
            // filter: resData.filter ?? [],
            columns: [],
          })
        );
        dispatch(setConvertInfoConvert(setResConvertData(resData)));
      },
    }
  );

  const debouncedEditRuleName = useDebouncedCallback((name: string) => {
    dispatch(
      setConvertInfo({
        edit_rule_name: name,
      })
    );
  }, 300);

  const onChangeEditRuleName: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      debouncedEditRuleName(e.target.value);
    },
    [debouncedEditRuleName]
  );

  const onClearRuleBase = useCallback(() => {
    dispatch(
      setConvertInfo({
        rule_base: undefined,
        select_info_row: undefined,
        select_header_row: undefined,
        filter: [],
        columns: [],
      })
    );
    dispatch(
      setConvertInfoConvert({
        info: [],
        header: [],
        custom: [],
      })
    );
  }, [dispatch]);

  const onChangeRuleBase = useCallback(() => {
    // const { value, label } = form.getFieldValue('select_rule_base');
    const value = form.getFieldValue('select_rule_base');
    dispatch(
      setConvertInfo({
        rule_base: value,
      })
    );
    readyReqRuleBaseRef.current = true;
  }, [form, dispatch, log_name_id, readyReqRuleBaseRef]);

  useEffect(() => {
    if (readyReqRuleBaseRef) {
      if (rule_base) {
        readyReqRuleBaseRef.current = false;
        refetchBaseRule();
      }
    }
  }, [readyReqRuleBaseRef, rule_base]);

  useEffect(() => {
    console.log(form.getFieldValue('select_rule_base'), rule_base);
    if (form.getFieldValue('select_rule_base') !== rule_base) {
      form.setFieldsValue({
        select_rule_base: rule_base ?? undefined,
      });
    }
  }, [rule_base]);

  useEffect(() => {
    form.setFieldsValue({
      log_name: log_name ?? undefined,
      edit_rule_name: edit_rule_name ?? undefined,
      table_name: table_name ?? undefined,
    });
  }, [log_name, edit_rule_name, table_name]);

  return {
    onChangeEditRuleName,
    onChangeRuleBase,
    onClearRuleBase,
    newRule,
    rule_type,
    ruleList,
    isFetching: isFetchingRuleList || isFetchingBaseRule,
  };
}

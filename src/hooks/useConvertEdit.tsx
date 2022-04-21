import { useForm } from 'antd/lib/form/Form';
import { LabeledValue } from 'antd/lib/select';
import { AxiosError } from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { CONVERT_RULE_STEP } from '../components/modules/Convert/ConvertEdit';
import { CrasErrorDescription } from '../components/modules/Convert/ConvertPreview';
import { getConvertOption, patchConvertEditRule, postConvertAddRule } from '../lib/api/axios/requests';
import { MUTATION_KEY } from '../lib/api/query/mutationKey';
import { PAGE_URL } from '../lib/constants';
import { PreviewValidationError, validateDataFilterData, validateHeadersColumnsData } from '../lib/util/convertRule';
import { openNotification } from '../lib/util/notification';
import {
  convertConvertTableSelector,
  convertEditRuleNameSelector,
  convertFilterTableSelector,
  convertLogNameIdSelector,
  convertLogNameSelector,
  convertNewRuleSelector,
  convertPreviewConvertOriginalSelector,
  convertPreviewSampleOriginalSelector,
  convertReqConvertCsv,
  convertReqConvertRegex,
  convertRuleIdSelector,
  convertRuleTypeSelector,
  convertTableNameSelector,
  initConvert,
  setConvertInfo,
} from '../reducers/slices/convert';
import { ReqConvertPreviewError, ReqSaveConvertRule, RuleOption } from '../types/convertRules';
import { useMutationPreviewConvert, useMutationPreviewFilter, useMutationPreviewSample } from './useConvertPreview';
import useUploadFiles from './useUploadFiles';

interface RulesConvertEditParams {
  id: string;
}

export interface FormConvertSelectRule {
  log_name: string;
  table_name: string;
  select_rule: LabeledValue;
  is_new_rule: boolean;
  rule_type: string;
}

export interface FormConvertHeadersColumns {
  log_name: string;
  edit_rule_name: string;
  table_name: string;
  select_rule_base: number;
}

export default function useConvertEdit() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams<RulesConvertEditParams>();
  const [current, setCurrent] = useState<number>(CONVERT_RULE_STEP.SELECT_RULE);
  const { initUploadFiles } = useUploadFiles();
  const [selectRuleForm] = useForm<FormConvertSelectRule>();
  const [headersColumsForm] = useForm<FormConvertHeadersColumns>();
  const { uploadFiles } = useUploadFiles();
  const ruleType = useSelector(convertRuleTypeSelector);
  const reqConvertCsv = useSelector(convertReqConvertCsv);
  const reqConvertRegex = useSelector(convertReqConvertRegex);
  const convertTable = useSelector(convertConvertTableSelector);
  const filterTable = useSelector(convertFilterTableSelector);
  const originalSample = useSelector(convertPreviewSampleOriginalSelector);
  const originalConvert = useSelector(convertPreviewConvertOriginalSelector);
  const isNewRule = useSelector(convertNewRuleSelector);
  const logId = useSelector(convertLogNameIdSelector);
  const logName = useSelector(convertLogNameSelector);
  const ruleId = useSelector(convertRuleIdSelector);
  const editRuleName = useSelector(convertEditRuleNameSelector);
  const tableName = useSelector(convertTableNameSelector);

  const { mutateAsync: mutateAsyncOption, isLoading: isFetchingOption } = useMutation(() => getConvertOption(), {
    mutationKey: MUTATION_KEY.RULES_CONVERT_OPTION,
    onError: (error: AxiosError) => {
      openNotification('error', 'Error', `Failed to get rule options`, error);
    },
    onSuccess: (resData: RuleOption) => {
      dispatch(
        setConvertInfo({
          option: resData,
        })
      );
    },
  });

  const { mutateAsync: reqPreviewSample, isLoading: isFetchingSample } = useMutationPreviewSample();
  const { mutateAsync: reqPreviewConvert, isLoading: isFetchingConvert } = useMutationPreviewConvert();
  const { mutateAsync: reqPreviewFilter, isLoading: isFetchingFilter } = useMutationPreviewFilter();

  const { mutateAsync: reqAdd, isLoading: isFetchingAdd } = useMutation(
    ({ logId, reqData }: { logId: number; reqData: ReqSaveConvertRule }) => postConvertAddRule(logId, reqData),
    {
      mutationKey: MUTATION_KEY.RULES_CONVERT_ADD_RULE,
      onError: (error: AxiosError<ReqConvertPreviewError>) => {
        openNotification(
          'error',
          'Error',
          <CrasErrorDescription msg={'Failed to add rule!'} cras_error={error.response?.data.cras_error} />,
          error
        );
      },
      onSuccess: () => {
        openNotification('success', 'Success', `Succeed to add rule.`);
      },
      onSettled: () => {
        history.push(PAGE_URL.RULES_CONVERT_RULES_ROUTE);
      },
    }
  );

  const { mutateAsync: reqEdit, isLoading: isFetchingEdit } = useMutation(
    ({ logId, ruleId, reqData }: { logId: number; ruleId: number; reqData: ReqSaveConvertRule }) =>
      patchConvertEditRule(logId, ruleId, reqData),
    {
      mutationKey: MUTATION_KEY.RULES_CONVERT_EDIT_RULE,
      onError: (error: AxiosError) => {
        openNotification(
          'error',
          'Error',
          <CrasErrorDescription msg={'Failed to edit rule!'} cras_error={error.response?.data.cras_error} />,
          error
        );
      },
      onSuccess: () => {
        openNotification('success', 'Success', `Succeed to edit rule.`);
      },
      onSettled: () => {
        history.push(PAGE_URL.RULES_CONVERT_RULES_ROUTE);
      },
    }
  );

  const actionSelectRule = async () => {
    try {
      // validate form data
      await selectRuleForm.validateFields();

      // get preview sample data
      if (uploadFiles.length > 0) {
        const reqFormData = new FormData();
        reqFormData.append('files', uploadFiles[0] as File);
        await reqPreviewSample({ ruleType: ruleType as string, formData: reqFormData });
      }

      // get options
      await mutateAsyncOption();
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const actionHeadersColumns = async () => {
    try {
      // validate form data
      await headersColumsForm.validateFields();

      // validate table data
      //checkHeadersColumnsData();
      validateHeadersColumnsData({ ruleType: ruleType as 'csv' | 'regex', convert: convertTable });

      // get preview convert data
      await reqPreviewConvert({
        ruleType: ruleType as string,
        reqData: {
          data: originalSample ?? null,
          convert: ruleType === 'csv' ? reqConvertCsv : reqConvertRegex,
        },
      });

      return true;
    } catch (e) {
      console.error(e);
      if (e instanceof PreviewValidationError) {
        openNotification('error', 'Error', <CrasErrorDescription msg={e.message} cras_error={e.crasError} />);
      }
      return false;
    }
  };

  const actionDataFilter = async () => {
    try {
      // validate table data
      validateDataFilterData({ filter: filterTable });

      // get preview filter data
      await reqPreviewFilter({
        data: originalConvert ?? null,
        filter:
          filterTable.map((item) => ({
            type: item.type,
            name: item.name,
            condition: item.condition,
          })) ?? [],
      });
    } catch (e) {
      console.error(e);
      if (e instanceof PreviewValidationError) {
        openNotification('error', 'Error', <CrasErrorDescription msg={e.message} cras_error={e.crasError} />);
      }
      return false;
    }

    if (isNewRule) {
      await reqAdd({
        logId: logId as number,
        reqData: {
          log_name: logName,
          table_name: tableName,
          rule_type: ruleType,
          rule_name: editRuleName,
          convert: ruleType === 'csv' ? reqConvertCsv : reqConvertRegex,
          filter: filterTable,
        },
      });
    } else {
      await reqEdit({
        logId: logId as number,
        ruleId: ruleId as number,
        reqData: {
          log_name: logName,
          table_name: tableName,
          rule_type: ruleType,
          rule_name: editRuleName,
          convert: ruleType === 'csv' ? reqConvertCsv : reqConvertRegex,
          filter: filterTable,
        },
      });
    }

    return true;
  };

  const nextAction = useCallback(async () => {
    switch (current) {
      case CONVERT_RULE_STEP.SELECT_RULE:
        if (!(await actionSelectRule())) {
          return false;
        }
        break;
      case CONVERT_RULE_STEP.HEADERS_COLUMNS:
        if (!(await actionHeadersColumns())) {
          return false;
        }
        break;
      case CONVERT_RULE_STEP.DATA_FILTER:
        if (!(await actionDataFilter())) {
          return false;
        }
        break;
      default:
        break;
    }
    return true;
  }, [current, actionSelectRule, actionHeadersColumns, actionDataFilter]);

  useEffect(() => {
    initUploadFiles();
    dispatch(initConvert());
  }, []);

  useEffect(() => {
    dispatch(
      setConvertInfo({
        log_name_id: +id,
      })
    );
  }, [id]);

  return {
    current,
    setCurrent,
    nextAction,
    selectRuleForm,
    headersColumsForm,
    isLoading: isFetchingOption || isFetchingSample || isFetchingConvert || isFetchingFilter,
  };
}

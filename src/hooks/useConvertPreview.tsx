import { FormInstance } from 'antd';
import { AxiosError } from 'axios';
import React, { useCallback, useMemo } from 'react';
import { useIsMutating, useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { CrasErrorDescription } from '../components/modules/Convert/ConvertPreview';
import {
  postConvertPreviewConvert,
  postConvertPreviewFilter,
  postConvertPreviewSample,
} from '../lib/api/axios/requests';
import { MUTATION_KEY } from '../lib/api/query/mutationKey';
import { PreviewValidationError, validateDataFilterData, validateHeadersColumnsData } from '../lib/util/convertRule';
import { openNotification } from '../lib/util/notification';
import {
  convertConvertTableSelector,
  convertFilterTableSelector,
  convertPreviewConvertOriginalSelector,
  convertPreviewConvertSelector,
  convertPreviewFilterSelector,
  convertPreviewSampleOriginalSelector,
  convertPreviewSampleSelector,
  convertReqConvertCsv,
  convertReqConvertRegex,
  convertRuleTypeSelector,
  setConvertPreviewConvertReducer,
  setConvertPreviewFilterReducer,
  setConvertPreviewSampleReducer,
} from '../reducers/slices/convert';
import {
  PreviewTable,
  ReqConvertPreviewConvert,
  ReqConvertPreviewError,
  ReqConvertPreviewFilter,
} from '../types/convertRules';
import { FormConvertSelectRule } from './useConvertEdit';
import useUploadFiles from './useUploadFiles';

interface UseConvertPreviewProps {
  type: 'sample' | 'convert' | 'filter';
  selectRuleForm?: FormInstance<FormConvertSelectRule>;
}

export default function useConvertPreview({ type, selectRuleForm }: UseConvertPreviewProps) {
  const original_sample = useSelector(convertPreviewSampleOriginalSelector);
  const original_convert = useSelector(convertPreviewConvertOriginalSelector);
  const previewSampleData = useSelector(convertPreviewSampleSelector);
  const previewConvertData = useSelector(convertPreviewConvertSelector);
  const previewFilterData = useSelector(convertPreviewFilterSelector);
  const reqPreviewConvertCsv = useSelector(convertReqConvertCsv);
  const reqPreviewConvertRegex = useSelector(convertReqConvertRegex);
  const filterTable = useSelector(convertFilterTableSelector);
  const ruleType = useSelector(convertRuleTypeSelector);
  const convertTable = useSelector(convertConvertTableSelector);
  const { uploadFiles } = useUploadFiles();

  const previewData = useMemo(() => {
    if (type === 'sample') {
      return previewSampleData;
    } else if (type === 'convert') {
      return previewConvertData;
    } else if (type === 'filter') {
      return previewFilterData;
    }
  }, [type, ruleType, previewSampleData, previewConvertData, previewFilterData]);

  const { mutate: mutatePreview, isLoading: isFetchingPreview } = useMutationPreviewSample();
  const requestPreviewSample = useCallback(() => {
    if (uploadFiles.length > 0) {
      const reqFormData = new FormData();
      reqFormData.append('files', uploadFiles[0] as File);
      mutatePreview({ ruleType: ruleType as string, formData: reqFormData });
    }
  }, [uploadFiles, mutatePreview]);

  const { mutate: mutateConvert, isLoading: isFetchingConvert } = useMutationPreviewConvert();
  const requestPreviewConvert = useCallback(() => {
    try {
      validateHeadersColumnsData({
        ruleType: ruleType as 'csv' | 'regex',
        convert: convertTable,
      });
    } catch (e) {
      console.error(e);
      if (e instanceof PreviewValidationError) {
        openNotification('error', 'Error', <CrasErrorDescription msg={e.message} cras_error={e.crasError} />);
      }
      return;
    }

    mutateConvert({
      ruleType: ruleType as string,
      reqData: {
        data: original_sample ?? null,
        convert: ruleType === 'csv' ? reqPreviewConvertCsv : reqPreviewConvertRegex,
      },
    });
  }, [reqPreviewConvertCsv, reqPreviewConvertRegex, original_sample, ruleType, convertTable]);

  const { mutate: mutateFilter, isLoading: isFetchingFilter } = useMutationPreviewFilter();
  const requestPreviewFilter = useCallback(() => {
    try {
      validateDataFilterData({ filter: filterTable });
    } catch (e) {
      console.error(e);
      if (e instanceof PreviewValidationError) {
        openNotification('error', 'Error', <CrasErrorDescription msg={e.message} cras_error={e.crasError} />);
      }
      return;
    }

    const newFilter =
      filterTable.map((item) => ({
        type: item.type,
        name: item.name,
        condition: item.condition,
      })) ?? [];

    mutateFilter({
      data: original_convert ?? null,
      filter: newFilter,
    });
  }, [filterTable, original_convert]);

  const requestPreview = () => {
    if (type === 'sample') {
      requestPreviewSample();
    } else if (type === 'convert') {
      requestPreviewConvert();
    } else if (type === 'filter') {
      requestPreviewFilter();
    }
  };

  return {
    ruleType,
    isFetching: isFetchingPreview || isFetchingConvert || isFetchingFilter,
    requestPreview,
    previewData,
    previewConvertData,
    isfile: uploadFiles.length > 0,
  };
}

export function useMutationPreviewSample() {
  const dispatch = useDispatch();
  return useMutation(
    ({ ruleType, formData }: { ruleType: string; formData: FormData }) =>
      postConvertPreviewSample({ ruleType, formData }),
    {
      mutationKey: MUTATION_KEY.RULES_CONVERT_PREVIEW_SAMPLE,
      onError: (error: AxiosError<ReqConvertPreviewError>) => {
        openNotification(
          'error',
          'Error',
          <CrasErrorDescription
            msg={'Failed to response the preview of sample log!'}
            cras_error={error?.response?.data?.cras_error}
          />,
          error
        );
      },
      onSuccess: (resData: PreviewTable) => {
        dispatch(setConvertPreviewSampleReducer(resData));
      },
    }
  );
}

export function useMutationPreviewConvert() {
  const dispatch = useDispatch();
  return useMutation(
    ({ ruleType, reqData }: { ruleType: string; reqData: ReqConvertPreviewConvert }) =>
      postConvertPreviewConvert({ ruleType, reqData }),
    {
      mutationKey: MUTATION_KEY.RULES_CONVERT_PREVIEW_CONVERT,
      onError: (error: AxiosError<ReqConvertPreviewError>) => {
        openNotification(
          'error',
          'Error',
          <CrasErrorDescription
            msg={'Failed to response the preview of convert log!'}
            cras_error={error?.response?.data?.cras_error}
          />,
          error
        );
      },
      onSuccess: (resData: PreviewTable) => {
        dispatch(setConvertPreviewConvertReducer(resData));
      },
    }
  );
}

export function useMutationPreviewFilter() {
  const dispatch = useDispatch();
  return useMutation((reqData: ReqConvertPreviewFilter) => postConvertPreviewFilter(reqData), {
    mutationKey: MUTATION_KEY.RULES_CONVERT_PREVIEW_CONVERT,
    onError: (error: AxiosError<ReqConvertPreviewError>) => {
      openNotification(
        'error',
        'Error',
        <CrasErrorDescription
          msg={'Failed to response the preview of filter log!'}
          cras_error={error?.response?.data?.cras_error}
        />,
        error
      );
    },
    onSuccess: (resData: PreviewTable) => {
      dispatch(setConvertPreviewFilterReducer(resData));
    },
  });
}

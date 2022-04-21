import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  convertPreviewSampleSelector,
  convertSelectHeaderRowSelector,
  convertSelectInfoRowSelector,
  setConvertInfo,
  setConvertInfoConvert,
} from '../reducers/slices/convert';
import { RuleData } from '../types/convertRules';

export default function useConvertCsvSelect() {
  const previewSample = useSelector(convertPreviewSampleSelector);
  const selectInfo = useSelector(convertSelectInfoRowSelector);
  const selectHeader = useSelector(convertSelectHeaderRowSelector);
  const dispatch = useDispatch();

  const onChangeSelectInfo = useCallback(
    (index: number, checked: boolean) => {
      if (checked) {
        if (previewSample.data) {
          dispatch(
            setConvertInfo({
              select_info_row: index,
              rule_base: undefined,
            })
          );

          const infoData = previewSample.data[index];
          const infoArray = Object.values(infoData);
          const reverse = Object.values(infoArray).reverse();

          const findIdx = reverse.findIndex((item) => item);
          if (findIdx != -1) {
            const dataIdx = reverse.length - findIdx - 1;
            const newInfoArray = infoArray.filter((item, idx) => idx <= dataIdx);
            const newInfoTable: RuleData[] = newInfoArray.map((item, idx) => ({
              index: idx,
              id: null,
              ruleId: null,
              type: null,
              row_index: index + 1,
              col_index: idx + 1,
              column: null,
              data: item as string,
              name: null,
              output_column: null,
              output_column_select: null,
              prefix: null,
              regex: null,
              data_type: 'text',
              coef: null,
              def_val: 'null',
              def_type: 'null',
              unit: null,
              re_group: null,
              skip: false,
            }));

            // const newInfoTable: RuleData[] = newInfoArray.map((item, idx) => ({
            //   index: idx,
            //   id: null,
            //   ruleId: null,
            //   type: null,
            //   row_index: index + 1,
            //   col_index: idx + 1,
            //   column: infoTable[idx]?.column ?? null,
            //   data: item as string,
            //   name: infoTable[idx]?.name ?? null,
            //   output_column: infoTable[idx]?.output_column ?? null,
            //   output_column_select: infoTable[idx]?.output_column_select ?? null,
            //   prefix: infoTable[idx]?.prefix ?? null,
            //   regex: infoTable[idx]?.regex ?? null,
            //   data_type: infoTable[idx]?.data_type ?? null,
            //   coef: infoTable[idx]?.coef ?? null,
            //   def_val: infoTable[idx]?.def_val ?? null,
            //   def_type: infoTable[idx]?.def_type ?? null,
            //   unit: infoTable[idx]?.unit ?? null,
            //   re_group: infoTable[idx]?.re_group ?? null,
            // }));
            dispatch(
              setConvertInfoConvert({
                info: newInfoTable,
              })
            );
          } else {
            dispatch(
              setConvertInfoConvert({
                info: [],
              })
            );
          }
        }
      } else {
        dispatch(
          setConvertInfo({
            select_info_row: undefined,
          })
        );

        dispatch(
          setConvertInfoConvert({
            info: [],
          })
        );
      }
    },
    [dispatch, previewSample]
  );

  const onChangeSelectHeader = useCallback(
    (index: number, checked: boolean) => {
      if (checked) {
        dispatch(
          setConvertInfo({
            select_header_row: index,
            rule_base: undefined,
          })
        );
        // const headerColumn = Object.values(previewSample.data[index]);
        // const headerData =
        //   previewSample.data.length > index + 1
        //     ? Object.values(previewSample.data[index + 1])
        //     : new Array(headerColumn.length).fill(null);

        const headerData = Object.values(previewSample.data[index]);

        const newHeaderTable: RuleData[] =
          headerData?.map((item, idx) => ({
            index: idx,
            id: null,
            ruleId: null,
            type: null,
            row_index: null,
            col_index: idx + 1,
            column: null,
            // column: headerColumn ? (headerColumn[idx] as string) : null,
            data: (item as string) ?? null,
            name: null,
            output_column: null,
            output_column_select: null,
            prefix: null,
            regex: null,
            data_type: 'text',
            coef: null,
            def_val: 'null',
            def_type: 'null',
            unit: null,
            re_group: null,
            skip: false,
          })) ?? [];

        // const newHeaderTable: RuleData[] =
        //   headerData?.map((item, idx) => ({
        //     index: idx,
        //     id: null,
        //     ruleId: null,
        //     type: null,
        //     row_index: null,
        //     col_index: idx + 1,
        //     column: headerColumn ? (headerColumn[idx] as string) : null,
        //     data: (item as string) ?? null,
        //     name: headerTable[idx]?.name ?? null,
        //     output_column: headerTable[idx]?.output_column ?? null,
        //     output_column_select: headerTable[idx]?.output_column_select ?? null,
        //     prefix: headerTable[idx]?.prefix ?? null,
        //     regex: headerTable[idx]?.regex ?? null,
        //     data_type: headerTable[idx]?.data_type ?? null,
        //     coef: headerTable[idx]?.coef ?? null,
        //     def_val: headerTable[idx]?.def_val ?? null,
        //     def_type: headerTable[idx]?.def_type ?? null,
        //     unit: headerTable[idx]?.unit ?? null,
        //     re_group: headerTable[idx]?.re_group ?? null,
        //   })) ?? [];

        dispatch(
          setConvertInfoConvert({
            header: newHeaderTable,
          })
        );
      } else {
        dispatch(
          setConvertInfo({
            select_header_row: undefined,
          })
        );
        dispatch(
          setConvertInfoConvert({
            header: [],
          })
        );
      }
    },
    [dispatch, previewSample]
  );

  return {
    previewSample,
    selectInfo,
    selectHeader,
    onChangeSelectInfo,
    onChangeSelectHeader,
  };
}
